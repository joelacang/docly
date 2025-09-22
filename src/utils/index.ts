import { Access, type WorkspaceMembership } from "@/types/workspace";

export function getWorkspaceAccess(details: WorkspaceMembership): Access {
  const { workspace, membership } = details;

  // No membership
  if (!membership) {
    return workspace.type === "Public" ? Access.READ_ONLY : Access.NO_ACCESS;
  }

  // Personal workspace
  if (workspace.type === "Personal") {
    return membership.role === "Owner" ? Access.OWNER : Access.NO_ACCESS;
  }

  // Private workspace
  if (workspace.type === "Private") {
    switch (membership.role) {
      case "Owner":
        return Access.OWNER;
      case "Admin":
        return Access.ADMIN;
      case "Editor":
        return Access.EDIT;
      case "Member":
      case "Guest":
        return Access.READ_ONLY;
      default:
        return Access.NO_ACCESS;
    }
  }

  // Public workspace
  if (workspace.type === "Public") {
    switch (membership.role) {
      case "Owner":
        return Access.OWNER;
      case "Admin":
        return Access.ADMIN;
      case "Editor":
        return Access.EDIT;
      default:
        return Access.READ_ONLY;
    }
  }

  return Access.NO_ACCESS;
}
