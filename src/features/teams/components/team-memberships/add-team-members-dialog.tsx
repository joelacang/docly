import DialogContainer from "@/components/custom/dialog-container";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useAddTeamMembersDialog } from "../../hooks/use-add-team-members-dialog";
import AddTeamMembersForm from "./add-team-members-form";
import { useMyWorkspaces } from "@/providers/workspace-provider";

const AddTeamMemberDialog = () => {
  const { open, isPending, onClose, team } = useAddTeamMembersDialog();
  const { currentWorkspace } = useMyWorkspaces();

  if (!team || !currentWorkspace) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (isPending) return;

        onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            {`Enter details of the user you want to add in the team ${team?.element.name}`}
          </DialogDescription>
        </DialogHeader>
        <DialogContainer>
          {team && currentWorkspace && (
            <AddTeamMembersForm
              team={team}
              workspaceId={currentWorkspace.workspace.id}
            />
          )}
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
