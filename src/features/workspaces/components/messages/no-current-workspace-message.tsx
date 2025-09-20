import InfoMessage from "@/components/messages/info-message";
import { Button } from "@/components/ui/button";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { WorkspaceMembership } from "@/types/workspace";

const NoCurrentWorkspaceMessage = () => {
  const { myWorkspaces } = useMyWorkspaces();
  return (
    <InfoMessage
      imageUrl="/images/not-found.png"
      message="You don't have any selected workspace."
    >
      <div className="flex flex-row items-center justify-center gap-4">
        <Button variant="green">Select Workspace</Button>
      </div>
    </InfoMessage>
  );
};

export default NoCurrentWorkspaceMessage;
