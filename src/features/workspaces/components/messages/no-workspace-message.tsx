"use client";
import InfoMessage from "@/components/messages/info-message";
import { Button } from "@/components/ui/button";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { useCreateWorkspaceDialog } from "../../hooks/create-workspace-dialog";

const NoWorkspaceMessage = () => {
  const { onOpen: openCreateWorkspace } = useCreateWorkspaceDialog();

  return (
    <div className="flex min-h-[calc(100vh-44px)] w-full items-center justify-center">
      <InfoMessage
        imageUrl="/images/not-found.png"
        message="You don't have any workspaces. Start creating one or join another."
      >
        <div className="flex flex-row items-center justify-center gap-4">
          <Button
            className="bg-gradient-to-br from-violet-400 to-purple-600"
            onClick={() => openCreateWorkspace()}
          >
            <PlusIcon />
            Create Workspace
          </Button>
          <Button className="bg-gradient-to-br from-sky-400 to-blue-600">
            <UserPlusIcon />
            Join Workspace
          </Button>
        </div>
      </InfoMessage>
    </div>
  );
};

export default NoWorkspaceMessage;
