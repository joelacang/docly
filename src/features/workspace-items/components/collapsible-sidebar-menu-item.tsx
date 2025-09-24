import { Button } from "@/components/ui/button";
import SidebarMenuButton from "@/features/sidebar/components/sidebar-menu-button";
import SidebarFolderDropdownMenu from "@/features/sidebar/components/sidebar-folder-dropdown-menu";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import type { FolderPreview } from "@/types/folder";
import { ELEMENT_DISPLAYS } from "@/utils/elements";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import FolderSidebarMenuItem from "./folder-sidebar-menu-item";
import WorkspaceItemsList from "./workspace-items-list";

interface Props {
  item: FolderPreview;
  isEditor?: boolean;
}

const CollapsibleSidebarMenuItem = ({ item, isEditor }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full" asChild>
        <FolderSidebarMenuItem
          item={item}
          isEditor={isEditor}
          open={open}
          unlocked
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="w-full">Content HERE</CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSidebarMenuItem;
