import { createFolderSchema, type FolderPreview } from "@/types/folder";
import { createTRPCRouter, workspaceEditProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { unknownError } from "@/server/helper-functions";
import { createElement } from "@/server/helper-functions/element";

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

          const folder = await tx.folder.create({
            data: {
              elementId: element.id,
              workspaceId: workspaceId,
              parentFolderId: parentFolderId,
              depth: depth,
            },
            select: {
              id: true,
              parentFolderId: true,
              workspaceId: true,
              depth: true,
            },
          });

          return { element, ...folder } satisfies FolderPreview;
        });

        return results;
      } catch (error) {
        throw new TRPCError(unknownError(error as Error));
      }
    }),
});
