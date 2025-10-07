import {
  createFolderSchema,
  type FolderItemsList,
  type FolderPreview,
} from "@/types/folder";
import {
  createTRPCRouter,
  workspaceEditProcedure,
  workspaceReadProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { unknownError } from "@/server/helper-functions";
import { createElement } from "@/server/helper-functions/element";
import z from "zod";
import {
  CollectionPreviewPrismaSelection,
  ElementPreviewPrismaSelection,
  FolderPreviewPrismaSelection,
} from "@/server/helper-functions/prisma";
import { convertToFolderPreview } from "@/server/helper-functions/folder";
import { convertToCollectionPreview } from "@/server/helper-functions/collection";
import { ElementStatus } from "@prisma/client";
import type { CollectionPreview } from "@/types/collection";

export const folderRouter = createTRPCRouter({
  create: workspaceEditProcedure
    .input(createFolderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const { workspaceId, parentFolderId, teamId, depth, ...otherFields } =
            input;

          const element = await createElement({
            data: { ...otherFields },
            transaction: tx,
            loggedUserId: ctx.session.user.id,
          });

          const folderData = await tx.folder.create({
            data: {
              elementId: element.id,
              workspaceId: workspaceId,
              parentFolderId: parentFolderId,
              teamId,
              depth: depth,
            },
            select: FolderPreviewPrismaSelection,
          });

          const folder: FolderPreview = convertToFolderPreview(folderData);

          return folder;
        });

        return results;
      } catch (error) {
        throw new TRPCError(unknownError(error as TRPCError));
      }
    }),

  getFolderItems: workspaceReadProcedure
    .input(z.object({ parentFolderId: z.cuid().nullable() }))
    .query(async ({ ctx, input }) => {
      const foldersData = await ctx.db.folder.findMany({
        where: {
          parentFolderId: input.parentFolderId ?? null,
          workspaceId: input.workspaceId,
        },
        select: {
          ...FolderPreviewPrismaSelection,
          element: {
            select: {
              ...ElementPreviewPrismaSelection,
              favorites: {
                where: {
                  userId: ctx.session.user.id,
                },
                select: {
                  id: true,
                },
                take: 1,
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

      const collectionsData = await ctx.db.collection.findMany({
        where: { folderId: input.parentFolderId ?? null },
        select: {
          ...CollectionPreviewPrismaSelection,
          element: {
            select: {
              ...ElementPreviewPrismaSelection,
              favorites: {
                where: {
                  userId: ctx.session.user.id,
                },
                select: {
                  id: true,
                },
                take: 1,
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

      const folders = foldersData.map((folder) => {
        const { element, ...folderFields } = folder;
        const { favorites, ...elementFields } = element;

        const folderPreview = convertToFolderPreview({
          ...folderFields,
          element: elementFields,
        });

        return {
          ...folderPreview,
          favoriteId: favorites[0]?.id ?? null,
        } satisfies FolderPreview;
      });

      const collections = collectionsData.map((collection) => {
        const { element, ...collectionFields } = collection;
        const { favorites, ...elementFields } = element;

        const collectionPreview = convertToCollectionPreview({
          ...collectionFields,
          element: elementFields,
        });

        return {
          ...collectionPreview,
          favoriteId: favorites[0]?.id ?? null,
        } satisfies CollectionPreview;
      });

      return { folders, collections } satisfies FolderItemsList;
    }),

  delete: workspaceEditProcedure
    .input(z.object({ folderId: z.cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.$transaction(async (tx) => {
          const folder = await tx.folder.findUnique({
            where: { id: input.folderId },
            select: { elementId: true },
          });

          if (!folder) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Folder not found.",
            });
          }
          //Change status to deleted.
          await tx.element.update({
            where: { id: folder.elementId },
            data: {
              status: ElementStatus.Deleted,
            },
          });

          return { success: true };
        });

        return result;
      } catch (error) {
        throw new TRPCError(unknownError(error as TRPCError));
      }
    }),
});
