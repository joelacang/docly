import { createFolderSchema, type FolderPreview } from "@/types/folder";
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
  FolderPreviewPrismaSelection,
} from "@/server/helper-functions/prisma";
import { convertToFolderPreview } from "@/server/helper-functions/folder";
import { convertToCollectionPreview } from "@/server/helper-functions/collection";

export const folderRouter = createTRPCRouter({
  create: workspaceEditProcedure
    .input(createFolderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const { workspaceId, parentFolderId, depth, ...otherFields } = input;

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
              depth: depth,
            },
            select: FolderPreviewPrismaSelection,
          });

          const folder: FolderPreview = convertToFolderPreview(folderData);

          return folder;
        });

        return results;
      } catch (error) {
        throw new TRPCError(unknownError(error as Error));
      }
    }),

  getFolderItems: workspaceReadProcedure
    .input(z.object({ parentFolderId: z.cuid().nullable() }))
    .query(async ({ ctx, input }) => {
      const foldersData = await ctx.db.folder.findMany({
        where: { parentFolderId: input.parentFolderId ?? null },
        select: FolderPreviewPrismaSelection,
        orderBy: {
          element: {
            name: "asc",
          },
        },
      });

      const collectionsData = await ctx.db.collection.findMany({
        where: { folderId: input.parentFolderId ?? null },
        select: CollectionPreviewPrismaSelection,
        orderBy: {
          element: {
            name: "asc",
          },
        },
      });

      const folders = foldersData.map((folder) => {
        return convertToFolderPreview(folder);
      });

      const collections = collectionsData.map((collection) => {
        return convertToCollectionPreview(collection);
      });

      return { folders, collections };
    }),
});
