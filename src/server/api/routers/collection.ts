import { createCollectionSchema } from "@/types/collection";
import { createTRPCRouter, workspaceEditProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { unknownError } from "@/server/helper-functions";
import z from "zod";
import { createElement } from "@/server/helper-functions/element";
import { CollectionPreviewPrismaSelection } from "@/server/helper-functions/prisma";
import { convertToCollectionPreview } from "@/server/helper-functions/collection";
import { ElementStatus } from "@prisma/client";

export const collectionRouter = createTRPCRouter({
  create: workspaceEditProcedure
    .input(createCollectionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const {
            parentFolderId,
            workspaceId,
            collectionType,
            ...elementFields
          } = input;

          const element = await createElement({
            data: { ...elementFields },
            transaction: tx,
            loggedUserId: ctx.session.user.id,
          });

          const collectionData = await tx.collection.create({
            data: {
              workspaceId,
              folderId: parentFolderId,
              type: collectionType,
              elementId: element.id,
            },
            select: CollectionPreviewPrismaSelection,
          });

          const collection = convertToCollectionPreview(collectionData);

          return collection;
        });

        return results;
      } catch (error) {
        throw new TRPCError(unknownError(error as Error));
      }
    }),

  delete: workspaceEditProcedure
    .input(z.object({ collectionId: z.cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.$transaction(async (tx) => {
          const collection = await tx.collection.findUnique({
            where: { id: input.collectionId },
            select: { elementId: true },
          });

          if (!collection) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Collection not found.",
            });
          }

          await tx.element.update({
            where: { id: collection.elementId },
            data: {
              status: ElementStatus.Deleted,
            },
          });

          return { success: true };
        });

        return result;
      } catch (error) {
        throw new TRPCError(unknownError(error as Error));
      }
    }),
});
