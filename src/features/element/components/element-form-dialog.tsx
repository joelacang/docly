import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useElementFormDialog } from "../hooks/use-element-form-dialog";
import ElementForm from "./element-form";

const ElementFormDialog = () => {
  const { open, onClose, elementType, isPending } = useElementFormDialog();

  if (!elementType) return null;

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
          <DialogTitle>Create {elementType}</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your teams, folders and items.
          </DialogDescription>
        </DialogHeader>

        <ElementForm type={elementType} />
      </DialogContent>
    </Dialog>
  );
};

export default ElementFormDialog;
