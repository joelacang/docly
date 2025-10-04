import {
  TeamAccess,
  type MyTeamMembership,
  type TeamMemberProfile,
  type TeamMembershipDetails,
  type TeamSummary,
} from "@/types/team";
import type {
  MyTeamMembershipSelected,
  TeamMemberProfileSelected,
  TeamMembershipDetailsSelected,
  TeamSummarySelected,
} from "./prisma";
import { ElementStatus } from "@prisma/client";
import { Access } from "@/types/workspace";
import { convertToElementPreview } from "./element";

export function convertToTeamSummary(data: TeamSummarySelected) {
  const { _count, createdAt, element, ...teamFields } = data;

  const updatedElement = convertToElementPreview(element);
  return {
    ...teamFields,
    element: updatedElement,
    membersCount: _count.members,
    creationDate: createdAt,
  } as TeamSummary;
}

export function convertToTeamMembershipDetails(
  data: TeamMembershipDetailsSelected,
) {
  const { createdAt, ...membershipFields } = data;

  return {
    ...membershipFields,
    joinDate: createdAt,
  } as TeamMembershipDetails;
}

export function convertToTeamMemberProfile(data: TeamMemberProfileSelected) {
  const { member, ...membershipFields } = data;

  const membership = convertToTeamMembershipDetails(membershipFields);

  return {
    id: membership.id,
    membership,
    member,
  } as TeamMemberProfile;
}

export function convertToMyTeamMembership(data: MyTeamMembershipSelected) {
  const { team, ...membershipFields } = data;

  const teamSummary = convertToTeamSummary(team);
  const membership = convertToTeamMembershipDetails(membershipFields);

  return {
    team: teamSummary,
    membership,
  } as MyTeamMembership;
}

/**
 * Access rules for team-scoped items. Requires either:
 * - Team-level access (e.g. LEADER, ADMIN), or
 * - Workspace-level fallback access (e.g. ADMIN)
 */
export function isTeamItemAccessible(
  status: ElementStatus,
  teamAccess: TeamAccess = TeamAccess.NO_ACCESS,
  workspaceAccess: Access,
): boolean {
  const isWsAdmin = workspaceAccess >= Access.ADMIN;

  switch (status) {
    case ElementStatus.Pending:
    case ElementStatus.Draft:
      return isWsAdmin;

    case ElementStatus.Active:
      return teamAccess >= TeamAccess.READ_ONLY || isWsAdmin;

    case ElementStatus.Restricted:
      return teamAccess >= TeamAccess.ADMIN || isWsAdmin;

    case ElementStatus.Deleted:
      return teamAccess >= TeamAccess.LEADER || isWsAdmin;

    default:
      return false;
  }
}
