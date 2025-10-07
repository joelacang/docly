import type { CollectionPreview } from "@/types/collection";
import type { CollectionPreviewSelected } from "./prisma";

export function convertToCollectionPreview(
  data: CollectionPreviewSelected,
): CollectionPreview {
  return {
    id: data.id,
    element: {
      ...data.element,
      owners: data.element.owners.map((o) => o.owner),
    },
    parentFolderId: data.folderId,
    workspaceId: data.workspaceId,
    teamId: data.teamId,
    type: data.type,
  };
}
