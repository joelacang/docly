import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAddItemDialog } from "@/features/workspace-items/hooks/use-add-item-dialog";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { MenuItem } from "@/types";
import type { CollectionPreview } from "@/types/collection";
import { Colors } from "@/utils/colors";
import { COLLECTION_DISPLAYS } from "@/utils/elements";
import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import {
  FileInputIcon,
  FilePlusIcon,
  FolderIcon,
  MoreHorizontalIcon,
  PencilIcon,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from "lucide-react";

interface Props extends DropdownMenuProps {
  open?: boolean;
  collection: CollectionPreview;
  isEditor?: boolean;
}
const SidebarCollectionDropdownMenu = ({
  collection,
  isEditor,
  ...props
}: Props) => {
  const color = Colors[collection.element.color];
  const { currentWorkspace } = useMyWorkspaces();
  const wsColor = Colors[currentWorkspace?.workspace.element.color ?? "BLUE"];
  const collectionDisplay = COLLECTION_DISPLAYS[collection.type];

  const items: MenuItem[] = [
    {
      id: `add-new-entry`,
      label: `Add New ${collectionDisplay.entry}`,
      icon: FilePlusIcon,
      hidden: !isEditor,
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
    },
    {
      id: "add-to-favorites",
      label: "Add To Favorites",
      icon: StarIcon,
      hasSeparator: true,
    },
    {
      id: "remove-from-favorites",
      label: "Remove From Favorites",
      icon: StarOffIcon,
      hasSeparator: true,
    },
    {
      id: `edit-${collection.type}`,
      label: `Edit ${collection.type}`,
      icon: PencilIcon,
      hidden: !isEditor,
    },
    {
      id: `delete-${collection.type}`,
      label: `Delete ${collection.type}`,
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
