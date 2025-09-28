import { QueryStateHandler } from "@/components/query-state-handler";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Loader2Icon, PlusIcon, SearchXIcon } from "lucide-react";
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
import Centered from "@/components/layout/centered";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Colors } from "@/utils/colors";
import Loading from "@/components/loading";
import AlertMessage from "@/components/messages/alert-message";

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
  const { currentWorkspace } = useMyWorkspaces();
  const {
    data: items,
    isLoading,
    isError,
    error,
    refetch,
  } = api.folder.getFolderItems.useQuery({
    parentFolderId,
    workspaceId,
  });
  const isEmpty =
    items?.folders.length === 0 && items?.collections.length === 0;

  useEffect(() => {
    if (onEmpty) {
      if (!items) return;

      onEmpty(isEmpty);
    }
  }, [onEmpty, items]);

  useEffect(() => {
    if (workspaceId) {
      refetch().catch((error) =>
        console.error(`Error refetching getWorkspaceItems`, error),
      );
    }
  }, [workspaceId]);

  return (
    <QueryStateHandler
      data={items}
      isLoading={isLoading}
      isError={isError}
      errorTitle="Error Loading Items."
      errorMessage={error?.message ?? "An unknown error occurred."}
      loadingLabel={
        <div className="px-4 py-1">
          {parentFolderId === null ? (
            <Centered className="py-8">
              <Loading label="Loading Items..." />
            </Centered>
          ) : (
            <Loader2Icon
              className="size-6 animate-spin"
              color={
                Colors[currentWorkspace?.workspace.element.color ?? "BLUE"]
                  .primary
              }
            />
          )}
        </div>
      }
      emptyTitle="No Items Found."
      emptyDescription={`No items found on this ${parentFolderId ? "folder" : "workspace."}`}
      emptyContent={isEditor && <AddItemButton />}
    >
      {(items) => (
        <>
          {!isEmpty ? (
            <div>
              {items.folders.map((i) => {
                if (i.items > 0) {
                  return (
                    <CollapsibleSidebarMenuItem
                      key={i.id}
                      item={i}
                      isEditor={isEditor}
                    />
                  );
                } else {
                  return <FolderSidebarMenuItem item={i} key={i.id} />;
                }
              })}
              {items.collections.map((i) => (
                <CollectionSidebarMenuItem item={i} key={i.id} />
              ))}
            </div>
          ) : (
            <AlertMessage
              title="No items found"
              description="No items found for this workspace. Add Item now."
              icon={SearchXIcon}
            >
              <AddItemButton />
            </AlertMessage>
          )}
        </>
      )}
    </QueryStateHandler>
  );
};

export default WorkspaceItemsList;
