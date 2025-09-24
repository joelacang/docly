import { QueryStateHandler } from "@/components/query-state-handler";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { useAddItemDialog } from "../hooks/use-add-item-dialog";
import type { MenuItem } from "@/types";
import { ELEMENT_DISPLAYS } from "@/utils/elements";
import { useEffect } from "react";
import AddItemButton from "./add-item-button";
import FolderSidebarMenuItem from "./folder-sidebar-menu-item";
import CollectionSidebarMenuItem from "./collection-sidebar-menu-item";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import CollapsibleSidebarMenuItem from "./collapsible-sidebar-menu-item";

interface Props {
  parentFolderId: string | null;
  workspaceId: string;
  isEditor?: boolean;
  onEmpty?: (added: boolean) => void;
}

const WorkspaceItemsList = ({
  parentFolderId,
  workspaceId,
  isEditor,
  onEmpty,
}: Props) => {
  const {
    data: items,
    isLoading,
    isError,
    error,
  } = api.folder.getFolderItems.useQuery({
    parentFolderId,
    workspaceId,
  });

  useEffect(() => {
    if (onEmpty) {
      if (!items) return;

      const emptyFolders = items.folders.length === 0;
      const emptyCollections = items.collections.length === 0;

      onEmpty(emptyFolders && emptyCollections);
    }
  }, [onEmpty, items]);

  return (
    <QueryStateHandler
      data={items}
      isLoading={isLoading}
      isError={isError}
      errorTitle="Error Loading Items."
      errorMessage={error?.message ?? "An unknown error occurred."}
      loadingLabel="Loading Items..."
      emptyTitle="No Items Found."
      emptyDescription={`No items found on this ${parentFolderId ? "folder" : "workspace."}`}
      emptyContent={isEditor && <AddItemButton />}
    >
      {(items) => (
        <div className="pl-2">
          {items.folders.map((i) => {
            if (i.items > 0) {
              return <CollapsibleSidebarMenuItem key={i.id} item={i} />;
            } else {
              return <FolderSidebarMenuItem item={i} key={i.id} />;
            }
          })}
          {items.collections.map((i) => (
            <CollectionSidebarMenuItem item={i} key={i.id} />
          ))}
        </div>
      )}
    </QueryStateHandler>
  );
};

export default WorkspaceItemsList;
