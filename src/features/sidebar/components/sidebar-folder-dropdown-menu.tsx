import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFolderFormDialog } from "@/features/folders/hooks/use-folder-form-dialog";
import { useAddItemDialog } from "@/features/workspace-items/hooks/use-add-item-dialog";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { MenuItem } from "@/types";
import type { FolderPreview } from "@/types/folder";
import { Colors } from "@/utils/colors";
import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import {
  FilePlusIcon,
  FolderIcon,
  FolderInputIcon,
  FolderPlusIcon,
  MoreHorizontalIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";

interface Props extends DropdownMenuProps {
  open?: boolean;
  folder: FolderPreview;
  isEditor?: boolean;
}
const SidebarFolderDropdownMenu = ({ folder, isEditor, ...props }: Props) => {
  const color = Colors[folder.element.color];
  const { currentWorkspace } = useMyWorkspaces();
  const wsColor = Colors[currentWorkspace?.workspace.element.color ?? "BLUE"];
  const { onOpen: openAddFolder } = useFolderFormDialog();
  const { onOpenAddCollection: openAddCollection } = useAddItemDialog();
  const items: MenuItem[] = [
    {
      id: "new-subfolder",
      label: "Add New Sub-Folder",
      icon: FolderPlusIcon,
      hidden: !isEditor,
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
    },
    {
      id: "add-to-favorites",
      label: "Add To Favorites",
      icon: StarIcon,
      hasSeparator: true,
    },
    {
      id: "edit-folder",
      label: "Edit Folder",
      icon: PencilIcon,
      hidden: !isEditor,
    },
    {
      id: "delete-folder",
      label: "Delete Folder",
      icon: TrashIcon,
      hidden: !isEditor,
      mode: "destructive",
    },
  ];
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button className="focus-within:ring-0" variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-72">
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
        {items.map((item) => (
          <MyDropdownMenuItem key={item.id} item={item} color={wsColor} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarFolderDropdownMenu;
