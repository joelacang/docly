import type { FolderPreview } from "@/types/folder";
import type { FolderPreviewSelected } from "./prisma";

export function convertToFolderPreview(
  data: FolderPreviewSelected,
): FolderPreview {
  return {
    id: data.id,
    element: data.element,
    depth: data.depth,
    parentFolderId: data.parentFolderId,
    workspaceId: data.workspaceId,
    items: data._count.childFolders + data._count.collections,
  };
}
