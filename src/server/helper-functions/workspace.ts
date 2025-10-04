import { Access, type WorkspaceMembership } from "@/types/workspace";
import {
  type WorkspaceType,
  type Prisma,
  MembershipRole,
  MembershipStatus,
  ElementStatus,
} from "@prisma/client";
import { db } from "../db";
import { getWorkspaceAccess } from "@/utils";
import {
  ElementPreviewPrismaSelection,
  WorkspaceMembershipPrismaSelection,
  type WorkspaceMembershipSelected,
} from "./prisma";
import { convertToElementPreview } from "./element";
import { El_Messiri } from "next/font/google";

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
      role: MembershipRole.Owner,
      status: MembershipStatus.Active,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  const element = convertToElementPreview(workspace.element);

  const workspaceMembership: WorkspaceMembership = {
    workspace: {
      ...workspace,
      element,
    },
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

  const element = convertToElementPreview(data.workspace.element);

  const details: WorkspaceMembership = {
    workspace: {
      id: data.workspace.id,
      type: data.workspace.type,
      element,
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
  const { element: elementSelection, ...workspaceFields } = workspace;

  const element = convertToElementPreview(elementSelection);
  const result = {
    workspace: {
      ...workspaceFields,
      element,
    },
    membership: others,
  };

  return {
    ...result,
    access: getWorkspaceAccess(result),
  };
}

/**
 * Access rules for workspace-level items (e.g., folders, global resources).
 */
export function isWorkspaceItemAccessible(
  status: ElementStatus,
  access: Access,
): boolean {
  switch (status) {
    case ElementStatus.Pending:
    case ElementStatus.Restricted:
      return access >= Access.ADMIN;

    case ElementStatus.Active:
      return access >= Access.READ_ONLY;

    case ElementStatus.Deleted:
    case ElementStatus.Draft:
      return access === Access.OWNER;

    default:
      return false;
  }
}
