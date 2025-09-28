import z from "zod";
import { createElementBaseSchema, type ElementPreview } from "./element";
import { TeamPrivacy, TeamType, WorkspaceType } from "@prisma/client";
import type { FieldOption } from "./form";
import type { User } from "./user";

export const createTeamSchema = createElementBaseSchema.extend({
  workspaceId: z.cuid(),
  type: z.enum(TeamType),
  privacy: z.enum(TeamPrivacy),
  leaderIds: z.array(z.string()),
});

export type TeamPreview = {
  id: string;
  type: TeamType;
  privacy: TeamPrivacy;
  workspaceId: string;
  element: ElementPreview;
  membersCount: number;
  leaders: User[];
};
