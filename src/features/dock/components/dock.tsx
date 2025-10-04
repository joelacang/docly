"use client";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import UserMenu from "@/features/users/user-menu";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useJoinWorkspaceDialog } from "@/features/membership/hooks/use-join-workspace-dialog";
import { useCreateWorkspaceDialog } from "@/features/workspaces/hooks/create-workspace-dialog";

const Dock = () => {
  const { onOpen: openCreateWorkspace } = useCreateWorkspaceDialog();
  const { myWorkspaces, currentWorkspace, onSwitchWorkspace, isSwitching } =
    useMyWorkspaces();
  const { onOpen: openJoinWorkspace } = useJoinWorkspaceDialog();
  return (
    <div className="bg-dock border-dock-border hidden h-full w-20 flex-col items-center justify-between overflow-y-auto border-r py-4 md:flex">
      <div className="flex flex-1 flex-col items-center justify-start gap-6 py-4">
        <div className="flex flex-col items-center justify-start gap-3">
          {myWorkspaces.map((w) => (
            <Button
              className="size-fit hover:scale-110 hover:rounded-sm hover:shadow-lg hover:shadow-black/20 active:scale-95 active:shadow-inner"
              key={w.workspace.id}
              variant="ghost"
              disabled={isSwitching}
              size="icon"
              onClick={() => {
                if (currentWorkspace?.workspace.id !== w.workspace.id) {
                  onSwitchWorkspace(w);
                }
              }}
            >
              <WorkspaceAvatar
                workspace={w.workspace}
                isCurrent={currentWorkspace?.workspace.id === w.workspace.id}
              />
            </Button>
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
              disabled={isSwitching}
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
              disabled={isSwitching}
            >
              <SearchIcon className="size-6 text-white" />
            </Button>
          </Hint>
        </div>
      </div>

      <UserMenu />
    </div>
  );
};

export default Dock;
