import type {
  WorkspaceMembershipRole,
  WorkspaceMembershipStatus,
} from "@prisma/client";
import type { ElementDetail, ElementPreview } from "./element";

export type WorkspacePreview = {
  id: string;
  element: ElementPreview;
};

export type WorkspaceMembership = {
  workspace: WorkspacePreview;
  membership: {
    id: string;
    role: WorkspaceMembershipRole;
    status: WorkspaceMembershipStatus;
  };
};
