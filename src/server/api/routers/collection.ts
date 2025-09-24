import { createCollectionSchema } from "@/types/collection";
import { createTRPCRouter, workspaceEditProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { unknownError } from "@/server/helper-functions";
import z from "zod";
import { createElement } from "@/server/helper-functions/element";
import { CollectionPreviewPrismaSelection } from "@/server/helper-functions/prisma";
import { convertToCollectionPreview } from "@/server/helper-functions/collection";

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
});
