import DialogContainer from "@/components/custom/dialog-container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTeamFormDialog } from "../hooks/use-team-form-dialog";
import TeamForm from "./team-form";
import { useMyWorkspaces } from "@/providers/workspace-provider";

const TeamFormDialog = () => {
  const { open, onClose, isPending, onOpen } = useTeamFormDialog();
  const { currentWorkspace } = useMyWorkspaces();
  return (
    <Dialog
      open={open}
      onOpenChange={(openValue) => {
        if (isPending) return;

        if (openValue) {
          onOpen();
        } else {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Build a focused team to collaborate on projects and achieve shared
            goals
          </DialogDescription>
        </DialogHeader>
        <DialogContainer>
          {currentWorkspace && (
            <TeamForm workspaceId={currentWorkspace.workspace.id} />
          )}
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default TeamFormDialog;
