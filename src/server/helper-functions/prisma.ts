import { MembershipStatus, Prisma, TeamRole } from "@prisma/client";
import { UserPrismaSelection } from "./user";

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

const validWorkspaceMembershipPreviewSelection = Prisma.validator()(
  WorkspaceMembershipPrismaSelection,
);

export type ElementPreviewSelected = Prisma.ElementGetPayload<{
  select: typeof elementPreviewSection;
}>;

export type WorkspaceMembershipSelected = Prisma.WorkspaceMembershipGetPayload<{
  select: typeof validWorkspaceMembershipPreviewSelection;
}>;

export const FolderPreviewBaseSelection = {
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
};
export const FolderPreviewPrismaSelection = {
  ...FolderPreviewBaseSelection,
  element: {
    select: ElementPreviewPrismaSelection,
  },
};

export const validFolderPreviewSelection = Prisma.validator()(
  FolderPreviewPrismaSelection,
);

export type FolderPreviewSelected = Prisma.FolderGetPayload<{
  select: typeof validFolderPreviewSelection;
}>;

export const CollectionPreviewBaseSelection = {
  id: true,
  folderId: true,
  workspaceId: true,
  type: true,
};

export const CollectionPreviewPrismaSelection = {
  ...CollectionPreviewBaseSelection,
  element: {
    select: ElementPreviewPrismaSelection,
  },
};

export const validCollectionPreviewSelection = Prisma.validator()(
  CollectionPreviewPrismaSelection,
);

export type CollectionPreviewSelected = Prisma.CollectionGetPayload<{
  select: typeof validCollectionPreviewSelection;
}>;

export const MemberPreviewSelection = {
  id: true,
  role: true,
  status: true,
  joinDate: true,
  member: {
    select: UserPrismaSelection,
  },
};

export const validMemberPreviewSelection = Prisma.validator()(
  MemberPreviewSelection,
);

export type MemberPreviewSelected = Prisma.WorkspaceMembershipGetPayload<{
  select: typeof validMemberPreviewSelection;
}>;

export const WorkspacePreviewSelection = {
  id: true,
  type: true,
  element: {
    select: ElementPreviewPrismaSelection,
  },
};

export const TeamPreviewBaseSelection = {
  id: true,
  type: true,
  privacy: true,
  workspaceId: true,
  members: {
    where: {
      status: MembershipStatus.Active,
      role: TeamRole.Leader,
    },
    select: {
      member: {
        select: UserPrismaSelection,
      },
    },
  },
  _count: {
    select: {
      members: {
        where: { status: MembershipStatus.Active },
      },
    },
  },
};

export const TeamPreviewSelection = {
  ...TeamPreviewBaseSelection,
  element: {
    select: ElementPreviewPrismaSelection,
  },
};

export const validTeamPreviewSelection =
  Prisma.validator()(TeamPreviewSelection);

export type TeamPreviewSelected = Prisma.TeamGetPayload<{
  select: typeof validTeamPreviewSelection;
}>;
