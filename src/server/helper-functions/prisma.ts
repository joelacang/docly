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

export function convertToWorkspaceMembership(
  data: WorkspaceMembershipSelected,
): WorkspaceMembership {
  const { workspace, ...others } = data;

  const result = {
    workspace,
    membership: others,
  };

  return {
    ...result,
    access: getWorkspaceAccess(result),
  };
}
