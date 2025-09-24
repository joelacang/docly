import { Access, type WorkspaceMembership } from "@/types/workspace";
import {
  WorkspaceMembershipRole,
  WorkspaceMembershipStatus,
  type WorkspaceType,
  type Prisma,
} from "@prisma/client";
import { db } from "../db";
import { getWorkspaceAccess } from "@/utils";
import {
  ElementPreviewPrismaSelection,
  WorkspaceMembershipPrismaSelection,
  type WorkspaceMembershipSelected,
} from "./prisma";

export async function createWorkspace({
  elementId,
  workspaceType,
  loggedUserId,
  transaction,
}: {
  elementId: string;
  loggedUserId: string;
  transaction: Prisma.TransactionClient;
  workspaceType: WorkspaceType;
}): Promise<WorkspaceMembership> {
  const workspace = await transaction.workspace.create({
    data: {
      elementId,
      type: workspaceType,
    },
    select: {
      id: true,
      type: true,
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

  return {
    ...workspaceMembership,
    access: getWorkspaceAccess(workspaceMembership),
  };
}

export async function getWorkspaceMembership({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}): Promise<WorkspaceMembership | null> {
  const data = await db.workspaceMembership.findFirst({
    where: {
      workspaceId,
      memberId: userId,
    },
    select: WorkspaceMembershipPrismaSelection,
  });

  if (!data) return null;

  const details: WorkspaceMembership = {
    workspace: {
      id: data.workspace.id,
      type: data.workspace.type,
      element: data.workspace.element,
    },
    membership: {
      id: data.id,
      role: data.role,
      status: data.status,
    },
  };

  return { ...details, access: getWorkspaceAccess(details) };
}

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
