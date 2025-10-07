import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DialogContainer from "@/components/custom/dialog-container";
import { useAddItemDialog } from "../hooks/use-add-item-dialog";
import WorkspaceItemCard from "./workspace-item-card";
import { ELEMENT_DISPLAYS } from "@/utils/elements";

import { ElementType } from "@prisma/client";
import CollectionCategories from "./collection-categories";
import { useFolderFormDialog } from "@/features/folders/hooks/use-folder-form-dialog";
import { useMyWorkspaces } from "@/providers/workspace-provider";

const AddWorkspaceItemDialog = () => {
  const { open, onClose, showFolder, parentFolderId, teamId } =
    useAddItemDialog();
  const { onOpen: openAddFolder } = useFolderFormDialog();
  const { currentWorkspace } = useMyWorkspaces();

  const folderItem = ELEMENT_DISPLAYS.Folder;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Workspace Item</DialogTitle>
          <DialogDescription>
            Choose what type of content you&apos;d like to add to your
            workspace.
          </DialogDescription>
        </DialogHeader>
        <DialogContainer>
          {showFolder && (
            <div>
              <WorkspaceItemCard
                item={folderItem}
                onClick={() => {
                  if (currentWorkspace) {
                    openAddFolder({ teamId });
                  }
                }}
              />
            </div>
          )}
          <CollectionCategories
            parentFolderId={parentFolderId}
            teamId={teamId}
          />
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkspaceItemDialog;
