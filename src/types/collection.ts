import z4 from "zod/v4";
import { createElementBaseSchema, type ElementPreview } from "./element";
import { CollectionType } from "@prisma/client";

export const createCollectionSchema = createElementBaseSchema.extend({
  parentFolderId: z4.cuid().nullable().optional(),
  workspaceId: z4.cuid(),
  collectionType: z4.enum(CollectionType),
});

export type CollectionPreview = {
  id: string;
  type: CollectionType;
  workspaceId: string;
  parentFolderId?: string | null;
  element: ElementPreview;
};
