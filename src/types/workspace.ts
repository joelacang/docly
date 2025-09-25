import {
  type MembershipRole,
  type MembershipStatus,
  WorkspaceType,
} from "@prisma/client";
import { createElementBaseSchema, type ElementPreview } from "./element";
import z from "zod";

export type WorkspacePreview = {
  id: string;
  type: WorkspaceType;
  element: ElementPreview;
};
export type MembershipPreview = {
  id: string;
  role: MembershipRole;
  status: MembershipStatus;
};

export type WorkspaceMembership = {
  workspace: WorkspacePreview;
  membership: MembershipPreview | null;
  access?: Access;
};

export enum Access {
  OWNER = 4,
  ADMIN = 3,
  EDIT = 2,
  READ_ONLY = 1,
  NO_ACCESS = 0,
}

export const createWorkspaceSchema = createElementBaseSchema.extend({
  type: z.enum(WorkspaceType),
});
