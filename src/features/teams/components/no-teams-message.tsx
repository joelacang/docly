import AlertMessage from "@/components/messages/alert-message";
import { Button } from "@/components/ui/button";
import { Mode } from "@/types";
import { PlusIcon, UserPlusIcon, UserXIcon } from "lucide-react";
import { useTeamFormDialog } from "../hooks/use-team-form-dialog";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Access } from "@/types/workspace";

const NoTeamsMessage = () => {
  const { onOpen: openTeamFormDialog } = useTeamFormDialog();
  const { currentWorkspace } = useMyWorkspaces();
  const isAdmin =
    (currentWorkspace?.access ?? Access.NO_ACCESS) >= Access.ADMIN;

  return (
    <AlertMessage
      title="This workspace doesn't have any teams."
      description="This workspace does not have any teams created. Add one right now."
      icon={UserXIcon}
      mode={Mode.ERROR}
      dashed
    >
      <div className="space-x-2 pt-4">
        {isAdmin && (
          <Button variant="blue" onClick={openTeamFormDialog}>
            <PlusIcon />
            Add Team
          </Button>
        )}
        <Button variant="purple">
          <UserPlusIcon />
          Join Team
        </Button>
      </div>
    </AlertMessage>
  );
};

export default NoTeamsMessage;
