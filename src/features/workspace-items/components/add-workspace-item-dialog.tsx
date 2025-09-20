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
import { useElementFormDialog } from "@/features/element/hooks/use-element-form-dialog";
import { ElementType } from "@prisma/client";
import CollectionCategories from "./collection-categories";

const AddWorkspaceItemDialog = () => {
  const { open, onClose } = useAddItemDialog();
  const { onOpenFolder } = useElementFormDialog();
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
          <div>
            <div>
              <WorkspaceItemCard
                item={folderItem}
                onClick={() => onOpenFolder(null)}
              />
            </div>
            <CollectionCategories />
          </div>
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkspaceItemDialog;
