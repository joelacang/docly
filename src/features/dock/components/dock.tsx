import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useElementFormDialog } from "@/features/element/hooks/use-element-form-dialog";
import { useWorkspaceSidebar } from "@/features/workspaces/hooks/use-workspace-sidebar";
import UserMenu from "@/features/users/user-menu";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { ElementType } from "@prisma/client";
import { PlusIcon, SearchIcon, SidebarIcon, TriangleIcon } from "lucide-react";
import { useJoinWorkspaceDialog } from "@/features/membership/hooks/use-join-workspace-dialog";

const Dock = () => {
  const isMobile = useIsMobile();
  const { onToggle: toggleSidebar } = useWorkspaceSidebar();
  const { onOpenWorkspace } = useElementFormDialog();
  const { myWorkspaces } = useMyWorkspaces();
  const { onOpen: openJoinWorkspace } = useJoinWorkspaceDialog();
  return (
    <div
      className="hidden h-full w-20 flex-col items-center justify-between overflow-y-auto border-r py-4 md:flex"
      style={{ backgroundColor: "#F8FAFC", borderRightColor: "#E2E8F0" }}
    >
      <Button
        className="size-fit"
        variant="ghost"
        size="icon"
        onClick={() => {
          if (!isMobile) {
            toggleSidebar();
          }
        }}
      >
        <SidebarIcon className="size-5" />
      </Button>
      <div className="flex flex-1 flex-col items-center justify-start gap-6 py-4">
        <div className="flex flex-col items-center justify-start gap-3">
          {myWorkspaces.map((w) => (
            <div key={w.workspace.id} className="relative">
              <WorkspaceAvatar workspace={w.workspace} />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-start gap-2">
          <Hint tooltip="Add Workspace" side="right">
            <Button
              className="size-10 rounded-full bg-gradient-to-br from-teal-400 to-green-600"
              size="icon"
              type="button"
              onClick={() => onOpenWorkspace()}
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
