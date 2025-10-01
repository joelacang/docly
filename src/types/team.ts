import z from "zod";
import { createElementBaseSchema, type ElementPreview } from "./element";
import {
  type MembershipStatus,
  TeamPrivacy,
  TeamRole,
  TeamType,
} from "@prisma/client";
import type { User } from "./user";

export const createTeamSchema = createElementBaseSchema.extend({
  workspaceId: z.cuid(),
  type: z.enum(TeamType),
  privacy: z.enum(TeamPrivacy),
  leaderIds: z.array(z.string()),
  officerIds: z.array(z.string()),
  memberIds: z.array(z.string()),
});

export const addTeamMembersSchema = z.object({
  workspaceId: z.cuid(),
  teamId: z.cuid(),
  userIdsToAdd: z
    .array(
      z.object({
        tempId: z.string(),
        userId: z.string(),
        role: z.enum(TeamRole),
      }),
    )
    .nonempty({ message: "You must add at least one team member." })
    .refine(
      (arr) => {
        const seen = new Set();
        return arr.every((item) => {
          if (seen.has(item.userId)) return false;
          seen.add(item.userId);
          return true;
        });
      },
      {
        message: "Duplicate users are not allowed.",
      },
    ),
});

export type TeamMembershipDetails = {
  id: string;
  role: TeamRole;
  status: MembershipStatus;
  joinDate: Date;
};

export type TeamMemberProfile = {
  id: string;
  member: User;
  membership: TeamMembershipDetails;
};

export type TeamSummary = {
  id: string;
  type: TeamType;
  privacy: TeamPrivacy;
  workspaceId: string;
  element: ElementPreview;
  membersCount: number;
  creationDate: Date;
};

export type TeamMembers = {
  team: TeamSummary;
  members: TeamMemberProfile[];
};

export type MyTeamMembership = {
  team: TeamSummary;
  membership: TeamMembershipDetails;
};

export enum TeamAccess {
  LEADER = 3,
  ADMIN = 2,
  READ_ONLY = 1,
  NO_ACCESS = 0,
}

export type TeamMemberFormData = {
  tempId: string;
  user: User | null;
  role: TeamRole;
};

export function getTeamAccess(role: TeamRole): TeamAccess {
  switch (role) {
    case "Leader":
      return TeamAccess.LEADER;
    case "Officer":
      return TeamAccess.ADMIN;
    case "Member":
      return TeamAccess.READ_ONLY;
    default:
      return TeamAccess.NO_ACCESS;
  }
}
