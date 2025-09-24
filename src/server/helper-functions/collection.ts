import type { CollectionPreview } from "@/types/collection";
import type { CollectionPreviewSelected } from "./prisma";

export function convertToCollectionPreview(
  data: CollectionPreviewSelected,
): CollectionPreview {
  return {
    id: data.id,
    element: data.element,
    parentFolderId: data.folderId,
    workspaceId: data.workspaceId,
    type: data.type,
  };
}
