import type { FolderPreview } from "@/types/folder";
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
        <div>
          <FolderSidebarMenuItem item={item} open={open} unlocked />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="w-full pl-2">
        <WorkspaceItemsList
          parentFolderId={item.id}
          workspaceId={item.workspaceId}
          isEditor={isEditor}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSidebarMenuItem;
