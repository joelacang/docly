import { db } from "../db";
import {
  CollectionPreviewBaseSelection,
  ElementPreviewPrismaSelection,
  FolderPreviewBaseSelection,
  FolderPreviewPrismaSelection,
} from "./prisma";
import type { FolderItemsList, FolderPreview } from "@/types/folder";
import type { CollectionPreview } from "@/types/collection";
import { convertToFolderPreview } from "./folder";
import { convertToCollectionPreview } from "./collection";

export async function getFavorites({
  workspaceId,
  teamId,
  loggedUserId,
}: {
  workspaceId: string;
  teamId: string | null;
  loggedUserId: string;
}): Promise<FolderItemsList> {
  const favorites = await db.favorite.findMany({
    where: {
      userId: loggedUserId,
      workspaceId,
      ...(teamId && {
        element: {
          team: {
            id: teamId,
          },
        },
      }),
    },
    select: {
      id: true,
      element: {
        select: {
          ...ElementPreviewPrismaSelection,
          folder: {
            select: FolderPreviewBaseSelection,
          },
          collection: {
            select: CollectionPreviewBaseSelection,
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

  const folders: FolderPreview[] = [];
  const collections: CollectionPreview[] = [];

  for (const f of favorites) {
    if (f.element.type === "Folder" && f.element.folder !== null) {
      const { folder, ...element } = f.element;
      const folderPreview = convertToFolderPreview({
        ...folder,
        element,
      });

      folders.push({
        ...folderPreview,
        favoriteId: f.id,
      });
    }

    if (f.element.type === "Collection" && f.element.collection !== null) {
      const { collection, ...element } = f.element;
      const collectionPreview = convertToCollectionPreview({
        ...collection,
        element,
      });

      collections.push({
        ...collectionPreview,
        favoriteId: f.id,
      });
    }
  }

  return { folders, collections } satisfies FolderItemsList;
}
