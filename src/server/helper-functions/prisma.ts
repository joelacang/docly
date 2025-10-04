import { MembershipStatus, Prisma, TeamRole } from "@prisma/client";
import { UserPrismaSelection } from "./user";
import type { TeamMembershipDetails } from "@/types/team";

export const ElementPreviewPrismaSelection = {
  id: true,
  name: true,
  slug: true,
  status: true,
  type: true,
  color: true,
  description: true,
  avatarUrl: true,
  createdBy: {
    select: UserPrismaSelection,
  },
  owners: {
    select: {
      owner: {
        select: UserPrismaSelection,
      },
    },
  },
  createdAt: true,
  updatedAt: true,
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
  select: typeof ElementPreviewPrismaSelection;
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

export const TeamMembershipDetailsSelectedFields = {
  id: true,
  role: true,
  status: true,
  createdAt: true,
};

export const TeamMembershipDetailsSelectionValidator =
  Prisma.validator<Prisma.TeamMembershipFindManyArgs>()({
    select: TeamMembershipDetailsSelectedFields,
  });

export type TeamMembershipDetailsSelected = Prisma.TeamMembershipGetPayload<{
  select: typeof TeamMembershipDetailsSelectedFields;
}>;

export const TeamMemberProfileSelectedFields = {
  ...TeamMembershipDetailsSelectedFields,
  member: { select: UserPrismaSelection },
};

export const TeamMemberProfileValidator =
  Prisma.validator<Prisma.TeamMembershipFindManyArgs>()({
    select: TeamMemberProfileSelectedFields,
  });

export type TeamMemberProfileSelected = Prisma.TeamMembershipGetPayload<{
  select: typeof TeamMemberProfileSelectedFields;
}>;

export const TeamSummarySelectedFields = {
  id: true,
  type: true,
  privacy: true,
  workspaceId: true,
  createdAt: true,
  element: {
    select: ElementPreviewPrismaSelection,
  },
  _count: {
    select: {
      members: {
        where: {
          status: MembershipStatus.Active,
        },
      },
    },
  },
};

export const TeamSummaryValidator = Prisma.validator<Prisma.TeamFindManyArgs>()(
  {
    select: TeamSummarySelectedFields,
  },
);

export type TeamSummarySelected = Prisma.TeamGetPayload<{
  select: typeof TeamSummarySelectedFields;
}>;

export const MyTeamMembershipSelectedFields = {
  ...TeamMembershipDetailsSelectedFields,
  team: {
    select: TeamSummarySelectedFields,
  },
};

export const validMyTeamMembershipSelection =
  Prisma.validator<Prisma.TeamMembershipFindManyArgs>()({
    select: MyTeamMembershipSelectedFields,
  });

export type MyTeamMembershipSelected = Prisma.TeamMembershipGetPayload<{
  select: typeof MyTeamMembershipSelectedFields;
}>;
