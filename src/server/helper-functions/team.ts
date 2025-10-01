import type {
  MyTeamMembership,
  TeamMemberProfile,
  TeamMembershipDetails,
  TeamSummary,
} from "@/types/team";
import type {
  MyTeamMembershipSelected,
  TeamMemberProfileSelected,
  TeamMembershipDetailsSelected,
  TeamSummarySelected,
} from "./prisma";

export function convertToTeamSummary(data: TeamSummarySelected) {
  const { _count, createdAt, ...teamFields } = data;

  return {
    ...teamFields,
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
