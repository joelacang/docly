import DialogContainer from "@/components/custom/dialog-container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCollectionFormDialog } from "../hooks/use-collection-form-dialog";
import { COLLECTION_DISPLAYS } from "@/utils/elements";
import { Colors } from "@/utils/colors";
import CollectionForm from "./collection-form";
import { useMyWorkspaces } from "@/providers/workspace-provider";

const CollectionFormDialog = () => {
  const { open, onClose, isPending, collectionType, parentFolderId, teamId } =
    useCollectionFormDialog();
  const collectionDetails = COLLECTION_DISPLAYS[collectionType ?? "Notebook"];
  const { currentWorkspace } = useMyWorkspaces();
  const color = Colors[collectionDetails.color];
  const Icon = collectionDetails.icon;
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
          <div className="flex flex-row items-center justify-start gap-3">
            <Icon className="size-8" color={color.primary} fill={color.light} />
            <div className="flex flex-col">
              <DialogTitle>Create {collectionType}</DialogTitle>
              <DialogDescription>
                {collectionDetails.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogContainer>
          {collectionType && currentWorkspace && (
            <CollectionForm
              collectionType={collectionType}
              workspaceId={currentWorkspace.workspace.id}
              parentFolderId={parentFolderId}
              teamId={teamId}
            />
          )}
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionFormDialog;
