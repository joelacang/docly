import z4 from "zod/v4";
import { createTRPCRouter, workspaceReadProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  CollectionPreviewBaseSelection,
  ElementPreviewPrismaSelection,
  FolderPreviewBaseSelection,
} from "@/server/helper-functions/prisma";
import { ElementType } from "@prisma/client";
import { unknownError } from "@/server/helper-functions";
import { convertToFolderPreview } from "@/server/helper-functions/folder";

import { convertToCollectionPreview } from "@/server/helper-functions/collection";
import type { FolderItemsList, FolderPreview } from "@/types/folder";
import type { CollectionPreview } from "@/types/collection";

export const favoriteRouter = createTRPCRouter({
  add: workspaceReadProcedure
    .input(z4.object({ elementId: z4.cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.$transaction(async (tx) => {
          const favorited = await tx.favorite.findFirst({
            where: {
              userId: ctx.session.user.id,
              elementId: input.elementId,
              workspaceId: input.workspaceId,
            },
            select: { id: true },
          });

          if (favorited) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You have already added this item to your favorites.",
            });
          }

          const favorite = await tx.favorite.create({
            data: {
              elementId: input.elementId,
              userId: ctx.session.user.id,
              workspaceId: input.workspaceId,
            },
            select: {
              id: true,
              element: {
                select: {
                  ...ElementPreviewPrismaSelection,
                  folder: {
                    select: FolderPreviewBaseSelection,
                  },
                  collection: {
                    select: CollectionPreviewBaseSelection,
                  },
                },
              },
            },
          });

          if (
            favorite.element.type === ElementType.Folder &&
            favorite.element.folder
          ) {
            const { folder, ...elementFields } = favorite.element;

            const folderPreview = convertToFolderPreview({
              ...folder,
              element: elementFields,
            });

            console.log(`Folder Added To Favorite: `, folderPreview);
            return {
              folder: {
                ...folderPreview,
                favoriteId: favorite.id,
              },
            };
          }

          if (
            favorite.element.type === ElementType.Collection &&
            favorite.element.collection
          ) {
            const { collection, ...elementFields } = favorite.element;

            const collectionPreview = convertToCollectionPreview({
              ...collection,
              element: elementFields,
            });

            return {
              collection: {
                ...collectionPreview,
                favoriteId: favorite.id,
              },
            };
          }

          return null;
        });

        return result;
      } catch (error) {
        throw new TRPCError(unknownError(error as Error));
      }
    }),

  remove: workspaceReadProcedure
    .input(z4.object({ elementId: z4.cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.$transaction(async (tx) => {
          const favorite = await ctx.db.favorite.findFirst({
            where: {
              elementId: input.elementId,
              userId: ctx.session.user.id,
              workspaceId: input.workspaceId,
            },
            select: { id: true },
          });

          if (!favorite) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Favorite item not found.",
            });
          }

          await ctx.db.favorite.delete({
            where: { id: favorite.id },
          });

          return { success: true };
        });

        return result;
      } catch (error) {
        throw new TRPCError(unknownError(error as Error));
      }
    }),

  getFavorites: workspaceReadProcedure.query(async ({ ctx, input }) => {
    const favoritesData = await ctx.db.favorite.findMany({
      where: {
        workspaceId: input.workspaceId,
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        element: {
          select: {
            ...ElementPreviewPrismaSelection,
            folder: {
              select: FolderPreviewBaseSelection,
            },
            collection: {
              select: CollectionPreviewBaseSelection,
            },
          },
        },
      },
      orderBy: {
        element: {
          name: "asc",
        },
      },
    });

    const folders: FolderPreview[] = [];
    const collections: CollectionPreview[] = [];

    for (const f of favoritesData) {
      if (f.element.type === "Folder" && f.element.folder !== null) {
        const { folder, ...element } = f.element;
        const folderPreview = convertToFolderPreview({
          ...folder,
          element,
        });

        folders.push({
          ...folderPreview,
          favoriteId: f.id,
        });
      }

      if (f.element.type === "Collection" && f.element.collection !== null) {
        const { collection, ...element } = f.element;
        const collectionPreview = convertToCollectionPreview({
          ...collection,
          element,
        });

        collections.push({
          ...collectionPreview,
          favoriteId: f.id,
        });
      }
    }

    return { folders, collections } satisfies FolderItemsList;
  }),
});
