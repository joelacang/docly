import type { WorkspaceMembership } from "@/types/workspace";
import { getWorkspaceAccess } from "@/utils";
import { Prisma } from "@prisma/client";

export const ElementPreviewPrismaSelection = {
  id: true,
  name: true,
  slug: true,
  status: true,
  type: true,
  color: true,
};

const elementPreviewSection = Prisma.validator()(ElementPreviewPrismaSelection);

export const WorkspaceMembershipPrismaSelection = {
  id: true,
  role: true,
  status: true,
  workspace: {
    select: {
      id: true,
      type: true,
      element: {
        select: ElementPreviewPrismaSelection,
      },
    },
  },
};

const workspaceMembershipPreviewSelection = Prisma.validator()(
  WorkspaceMembershipPrismaSelection,
);

export type ElementPreviewSelected = Prisma.ElementGetPayload<{
  select: typeof elementPreviewSection;
}>;

export type WorkspaceMembershipSelected = Prisma.WorkspaceMembershipGetPayload<{
  select: typeof workspaceMembershipPreviewSelection;
}>;

export const FolderPreviewPrismaSelection = {
  id: true,
  parentFolderId: true,
  workspaceId: true,
  depth: true,
  _count: {
    select: {
      childFolders: true,
      collections: true,
    },
  },
  element: {
    select: ElementPreviewPrismaSelection,
  },
};

export const folderPreviewSelection = Prisma.validator()(
  FolderPreviewPrismaSelection,
);

export type FolderPreviewSelected = Prisma.FolderGetPayload<{
  select: typeof folderPreviewSelection;
}>;

export const CollectionPreviewPrismaSelection = {
  id: true,
  folderId: true,
  workspaceId: true,
  type: true,
  element: {
    select: ElementPreviewPrismaSelection,
  },
};

export const collectionPreviewSelection = Prisma.validator()(
  CollectionPreviewPrismaSelection,
);

export type CollectionPreviewSelected = Prisma.CollectionGetPayload<{
  select: typeof collectionPreviewSelection;
}>;
