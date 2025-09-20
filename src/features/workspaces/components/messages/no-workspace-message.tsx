import InfoMessage from "@/components/messages/info-message";
import { Button } from "@/components/ui/button";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { useElementFormDialog } from "../../../element/hooks/use-element-form-dialog";
import { ElementType } from "@prisma/client";

const NoWorkspaceMessage = () => {
  const { onOpenWorkspace } = useElementFormDialog();
  return (
    <InfoMessage
      imageUrl="/images/not-found.png"
      message="You don't have any workspaces. Start creating one or join another."
    >
      <div className="flex flex-row items-center justify-center gap-4">
        <Button
          className="bg-gradient-to-br from-violet-400 to-purple-600"
          onClick={() => onOpenWorkspace()}
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
  );
};

export default NoWorkspaceMessage;
