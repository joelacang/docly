import type { WorkspaceMembership } from "@/types/workspace";
import {
  WorkspaceMembershipRole,
  WorkspaceMembershipStatus,
  type Prisma,
} from "@prisma/client";
import { ElementPreviewPrismaSelection } from "./element";

export async function createWorkspace({
  elementId,
  loggedUserId,
  transaction,
}: {
  elementId: string;
  loggedUserId: string;
  transaction: Prisma.TransactionClient;
}): Promise<WorkspaceMembership> {
  const workspace = await transaction.workspace.create({
    data: {
      elementId,
    },
    select: {
      id: true,
      element: {
        select: ElementPreviewPrismaSelection,
      },
    },
  });

  const membership = await transaction.workspaceMembership.create({
    data: {
      workspaceId: workspace.id,
      memberId: loggedUserId,
      role: WorkspaceMembershipRole.Owner,
      status: WorkspaceMembershipStatus.Active,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  const workspaceMembership: WorkspaceMembership = {
    workspace,
    membership,
  };

  return workspaceMembership;
}
