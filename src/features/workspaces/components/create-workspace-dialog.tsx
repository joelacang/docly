import DialogContainer from "@/components/custom/dialog-container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceDialog } from "../hooks/create-workspace-dialog";
import CreateWorkspaceForm from "./create-workspace-form";

const CreateWorkspaceDialog = () => {
  const { open, onClose, onOpen, isPending } = useCreateWorkspaceDialog();
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
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Workspaces help you organize your projects, teams, or tasks in one
            place. Fill out the form below to create a new workspace.
          </DialogDescription>
        </DialogHeader>
        <DialogContainer>
          <CreateWorkspaceForm />
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
