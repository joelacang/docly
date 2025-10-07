import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFolderFormDialog } from "../hooks/use-folder-form-dialog";
import DialogContainer from "@/components/custom/dialog-container";
import FolderForm from "./folder-form";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import AlertMessage from "@/components/messages/alert-message";
import { Mode } from "@/types";

const FolderFormDialog = () => {
  const { open, teamId, isPending, parentFolderId, onOpen, onClose, depth } =
    useFolderFormDialog();
  const { currentWorkspace } = useMyWorkspaces();

  return (
    <Dialog
      open={open}
      onOpenChange={(openValue) => {
        if (isPending) return;

        if (openValue) {
          onOpen({});
        } else {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your items. Enter a name for your
            folder and click “Add” to proceed.
          </DialogDescription>
        </DialogHeader>
        <DialogContainer>
          {currentWorkspace?.workspace.id ? (
            <FolderForm
              parentFolderId={parentFolderId}
              workspaceId={currentWorkspace?.workspace.id}
              depth={depth}
              teamId={teamId}
            />
          ) : (
            <AlertMessage
              title="Missing Info"
              description="workspaceId not found. Please try again."
              mode={Mode.ERROR}
            />
          )}
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default FolderFormDialog;
