"use client";
import Logo from "@/components/logo";
import { SIZE } from "@/types";
import { useAuth } from "@/providers/auth-provider";
import ToggleSidebarButton from "@/features/dock/components/toggle-sidebar-button";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import WorkspaceDropdownMenu from "@/features/workspaces/components/workspace-dropdown-menu";

const NavbarContent = () => {
  const { loggedUser } = useAuth();
  const { currentWorkspace } = useMyWorkspaces();
  return (
    <div className="flex w-full flex-row items-center justify-between px-4 py-0.5">
      <div className="flex items-center justify-start gap-3">
        <ToggleSidebarButton />
        <Logo size={SIZE.SMALL} />
      </div>

      <div className="flex flex-row items-center justify-end gap-2">
        {currentWorkspace && (
          <WorkspaceDropdownMenu workspace={currentWorkspace} />
        )}
      </div>
    </div>
  );
};

export default NavbarContent;
