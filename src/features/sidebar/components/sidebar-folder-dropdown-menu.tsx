import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import ToastMessage from "@/components/custom/toast-message";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAddFolderToFavorite } from "@/features/folders/hooks/use-add-to-favorite";
import { useFolderFormDialog } from "@/features/folders/hooks/use-folder-form-dialog";
import { useRemoveFromFavorite as useRemoveFolderFromFavorite } from "@/features/folders/hooks/use-remove-from-favorite";
import { useAddItemDialog } from "@/features/workspace-items/hooks/use-add-item-dialog";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { api } from "@/trpc/react";
import { Mode, type MenuItem } from "@/types";
import type { FolderPreview } from "@/types/folder";
import { Access } from "@/types/workspace";
import { getWorkspaceAccess } from "@/utils";
import { Colors } from "@/utils/colors";
import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import {
  CopyIcon,
  FilePlusIcon,
  FolderIcon,
  FolderInputIcon,
  FolderPlusIcon,
  HistoryIcon,
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
  folder: FolderPreview;
}
const SidebarFolderDropdownMenu = ({ folder, ...props }: Props) => {
  const { mutate: deleteFolder, isPending: isDeletingFolder } =
    api.folder.delete.useMutation();
  const apiUtils = api.useUtils();
  const color = Colors[folder.element.color];
  const { currentWorkspace } = useMyWorkspaces();
  const wsColor = Colors[currentWorkspace?.workspace.element.color ?? "BLUE"];
  const { onOpen: openAddFolder } = useFolderFormDialog();
  const { onOpenAddCollection: openAddCollection } = useAddItemDialog();
  const { addToFavorite, isPending: isAddingToFavorites } =
    useAddFolderToFavorite();
  const { removeFromFavorite, isPending: isRemovingFromFavorites } =
    useRemoveFolderFromFavorite();

  const access = currentWorkspace
    ? getWorkspaceAccess(currentWorkspace)
    : Access.NO_ACCESS;
  const isEditor = access > Access.READ_ONLY;
  const isPending =
    isDeletingFolder || isAddingToFavorites || isRemovingFromFavorites;
  const favId = folder.favoriteId ?? null;

  const items: MenuItem[] = [
    {
      id: "new-subfolder",
      label: "Add New Sub-Folder",
      icon: FolderPlusIcon,
      hidden: !isEditor,
      disabled: isPending,
      action: () => {
        openAddFolder({
          parentFolderId: folder.id ?? null,
          depth: folder.depth + 1,
        });
      },
    },
    {
      id: "add-new-collection",
      label: "Add New Collection",
      icon: FilePlusIcon,
      hidden: !isEditor,
      disabled: isPending,
      action: () => {
        openAddCollection(folder.id);
      },
    },
    {
      id: "move-folder",
      label: "Move Folder",
      icon: FolderInputIcon,
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
      action: () => {
        addToFavorite({ folder });
      },
    },
    {
      id: "remove-from-favorite",
      label: "Remove from favorites",
      icon: StarOffIcon,
      hasSeparator: true,
      disabled: isPending,
      hidden: !favId,
      action: () => {
        removeFromFavorite({ folder });
      },
    },
    {
      id: "copy-url",
      label: "Copy URL",
      icon: CopyIcon,
      disabled: isPending,
    },
    {
      id: `share-folder`,
      label: `Share Folder`,
      icon: ShareIcon,
      disabled: isPending,
    },

    {
      id: "folder-activity",
      label: "Folder Activity",
      icon: HistoryIcon,
      hasSeparator: true,
      disabled: isPending,
    },
    {
      id: "edit-folder",
      label: "Edit Folder",
      icon: PencilIcon,
      hidden: !isEditor,
      disabled: isPending,
    },
    {
      id: "delete-folder",
      label: "Delete Folder",
      icon: TrashIcon,
      hidden: !isEditor,
      mode: "destructive",
      disabled: isPending,
      action: () => {
        const deleteToast = toast.loading("Deleting folder...");

        deleteFolder(
          { workspaceId: folder.workspaceId, folderId: folder.id },
          {
            onSuccess: () => {
              toast.custom(() => (
                <ToastMessage
                  title="Folder Delete"
                  message={`The folder ${folder.element.name} has been successfully deleted.`}
                  mode={Mode.SUCCESS}
                />
              ));
              apiUtils.folder.getFolderItems.setData(
                {
                  workspaceId: folder.workspaceId,
                  parentFolderId: folder.parentFolderId ?? null,
                },
                (prev) => {
                  if (!prev) return { folders: [], collections: [] };

                  const updatedFolders = prev.folders.filter(
                    (f) => f.id !== folder.id,
                  );

                  return { ...prev, folders: updatedFolders };
                },
              );
            },
            onError: (error) => {
              toast.custom(() => (
                <ToastMessage
                  title="Error Deleting Folder"
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
                {folder.element.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {folder.items} Items
              </p>
            </div>
          </div>
        </DropdownMenuGroup>
        {items.map((item) => {
          if (item.hidden) return null;
          return (
            <MyDropdownMenuItem key={item.id} item={item} color="workspace" />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarFolderDropdownMenu;
