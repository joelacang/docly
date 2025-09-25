import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import ToastMessage from "@/components/custom/toast-message";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAddCollectionToFavorite } from "@/features/collections/hooks/use-add-to-favorite";
import { useRemoveFromFavorite } from "@/features/collections/hooks/use-remove-from-favorite";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { api } from "@/trpc/react";
import { Mode, type MenuItem } from "@/types";
import type { CollectionPreview } from "@/types/collection";
import { Access } from "@/types/workspace";
import { getWorkspaceAccess } from "@/utils";
import { Colors } from "@/utils/colors";
import { COLLECTION_DISPLAYS } from "@/utils/elements";
import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import {
  CopyIcon,
  FileInputIcon,
  FilePlusIcon,
  FolderIcon,
  MoreHorizontalIcon,
  PencilIcon,
  ShareIcon,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from "lucide-react";
import toast from "react-hot-toast";

interface Props extends DropdownMenuProps {
  open?: boolean;
  collection: CollectionPreview;
}
const SidebarCollectionDropdownMenu = ({ collection, ...props }: Props) => {
  const { mutate: deleteCollection, isPending: isDeletingCollection } =
    api.collection.delete.useMutation();

  const { addToFavorite, isPending: isAddingFavorite } =
    useAddCollectionToFavorite();

  const { removeFromFavorite, isPending: isRemovingFavorite } =
    useRemoveFromFavorite();

  const apiUtils = api.useUtils();
  const color = Colors[collection.element.color];
  const { currentWorkspace } = useMyWorkspaces();
  const wsColor = Colors[currentWorkspace?.workspace.element.color ?? "BLUE"];
  const collectionDisplay = COLLECTION_DISPLAYS[collection.type];
  const access = currentWorkspace
    ? getWorkspaceAccess(currentWorkspace)
    : Access.NO_ACCESS;
  const isEditor = access > Access.READ_ONLY;

  const isPending =
    isDeletingCollection || isAddingFavorite || isRemovingFavorite;
  const favId = collection.favoriteId ?? null;

  const items: MenuItem[] = [
    {
      id: `add-new-entry`,
      label: `Add New ${collectionDisplay.entry}`,
      icon: FilePlusIcon,
      hidden: !isEditor,
      disabled: isPending,
      action: () => {
        alert("Not implemented yet");
      },
    },
    {
      id: "move-entry",
      label: "Move Entry",
      icon: FileInputIcon,
      hidden: !isEditor,
      hasSeparator: true,
      disabled: isPending,
    },
    {
      id: "add-to-favorites",
      label: "Add To Favorites",
      icon: StarIcon,
      hasSeparator: true,
      disabled: isPending,
      hidden: !!favId,
      action: () => addToFavorite({ collection }),
    },
    {
      id: "remove-from-favorites",
      label: "Remove From Favorites",
      icon: StarOffIcon,
      hasSeparator: true,
      disabled: isPending,
      hidden: !favId,
      action: () => removeFromFavorite({ collection }),
    },
    {
      id: "copy-url",
      label: "Copy URL",
      icon: CopyIcon,
      disabled: isPending,
    },
    {
      id: `share-${collection.type}`,
      label: `Share ${collection.type}`,
      icon: ShareIcon,
      disabled: isPending,
    },
    {
      id: `edit-${collection.type}`,
      label: `Edit ${collection.type}`,
      icon: PencilIcon,
      hidden: !isEditor,
      disabled: isPending,
    },
    {
      id: `delete-${collection.type}`,
      label: `Delete ${collection.type}`,
      icon: TrashIcon,
      hidden: !isEditor,
      mode: "destructive",
      disabled: isPending,
      action: () => {
        const deleteToast = toast.loading(`Removing Collection...`);

        deleteCollection(
          {
            workspaceId: collection.workspaceId,
            collectionId: collection.id,
          },
          {
            onSuccess: (response) => {
              if (response.success) {
                apiUtils.folder.getFolderItems.setData(
                  {
                    parentFolderId: collection.parentFolderId ?? null,
                    workspaceId: collection.workspaceId,
                  },
                  (prev) => {
                    if (!prev) return { folders: [], collections: [] };
                    const updatedCollections = prev.collections.filter(
                      (c) => c.id !== collection.id,
                    );

                    return { ...prev, collections: updatedCollections };
                  },
                );

                toast.custom(() => (
                  <ToastMessage
                    title="Collection Deleted."
                    message={`Collection ${collection.element.name} has been deleted from you workspace.`}
                    mode={Mode.DEFAULT}
                  />
                ));
              }
            },
            onError: (error) => {
              toast.custom(() => (
                <ToastMessage
                  title="Error deleting collection"
                  message={error.message}
                  mode={Mode.ERROR}
                />
              ));
            },
            onSettled: () => {
              toast.dismiss(deleteToast);
            },
          },
        );
      },
    },
  ];
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button className="focus-within:ring-0" variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="mx-2 my-4 w-72">
        <DropdownMenuGroup className="border-b">
          <div className="flex flex-row items-center gap-4 px-2 py-3">
            <FolderIcon
              className="size-8"
              color={color.primary}
              fill={color.light}
            />
            <div>
              <p className="line-clamp-1 text-lg leading-none font-semibold">
                {collection.element.name}
              </p>
            </div>
          </div>
        </DropdownMenuGroup>
        {items.map((item) => (
          <MyDropdownMenuItem key={item.id} item={item} color={wsColor} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarCollectionDropdownMenu;
