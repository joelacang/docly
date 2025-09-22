"use client";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useWorkspaceSidebar } from "@/features/workspaces/hooks/use-workspace-sidebar";
import UserMenu from "@/features/users/user-menu";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { PlusIcon, SearchIcon, SidebarIcon } from "lucide-react";
import { useJoinWorkspaceDialog } from "@/features/membership/hooks/use-join-workspace-dialog";
import { useCreateWorkspaceDialog } from "@/features/workspaces/hooks/create-workspace-dialog";

const Dock = () => {
  const isMobile = useIsMobile();
  const { onToggle: toggleSidebar, open: isSidebarOpen } =
    useWorkspaceSidebar();
  const { onOpen: openCreateWorkspace } = useCreateWorkspaceDialog();
  const { myWorkspaces, currentWorkspace } = useMyWorkspaces();
  const { onOpen: openJoinWorkspace } = useJoinWorkspaceDialog();
  return (
    <div className="bg-dock border-dock-border hidden h-full w-20 flex-col items-center justify-between overflow-y-auto border-r py-4 md:flex">
      <Hint
        tooltip={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        side="right"
      >
        <Button
          className="hover:bg-transparent"
          variant="ghost"
          size="icon"
          onClick={() => {
            if (!isMobile) {
              toggleSidebar();
            }
          }}
        >
          <SidebarIcon className="text-accent-foreground size-5" />
        </Button>
      </Hint>
      <div className="flex flex-1 flex-col items-center justify-start gap-6 py-4">
        <div className="flex flex-col items-center justify-start gap-3">
          {myWorkspaces.map((w) => (
            <div key={w.workspace.id} className="relative">
              <WorkspaceAvatar
                workspace={w.workspace}
                isCurrent={currentWorkspace?.workspace.id === w.workspace.id}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-start gap-2">
          <Hint tooltip="Add Workspace" side="right">
            <Button
              className="size-10 rounded-full"
              size="icon"
              type="button"
              variant="green"
              onClick={() => openCreateWorkspace()}
            >
              <PlusIcon className="size-6" />
            </Button>
          </Hint>
          <Hint tooltip="Join Workspace" side="right">
            <Button
              className="size-10 rounded-full"
              variant="blue"
              size="icon"
              type="button"
              onClick={() => openJoinWorkspace()}
            >
              <SearchIcon className="size-6 text-white" />
            </Button>
          </Hint>
        </div>
      </div>

      {/* Workspaces Avatar Here.... */}
      <UserMenu />
    </div>
  );
};

export default Dock;
