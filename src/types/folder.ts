import z from "zod";
import { createElementBaseSchema, type ElementPreview } from "./element";

export const createFolderSchema = createElementBaseSchema.extend({
  parentFolderId: z.cuid().nullable().optional(),
  workspaceId: z.cuid(),
  depth: z.int(),
});

export type FolderPreview = {
  id: string;
  element: ElementPreview;
  workspaceId: string;
  parentFolderId?: string | null;
  depth: number;
};
