import { QueryStateHandler } from "@/components/query-state-handler";
import { api } from "@/trpc/react";
import { Loader2Icon, SearchXIcon } from "lucide-react";
import { useEffect } from "react";
import Centered from "@/components/layout/centered";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Colors } from "@/utils/colors";
import Loading from "@/components/loading";
import AlertMessage from "@/components/messages/alert-message";
import CollapsibleSidebarMenuItem from "@/features/workspace-items/components/collapsible-sidebar-menu-item";
import AddItemButton from "@/features/workspace-items/components/add-item-button";
import FolderSidebarMenuItem from "@/features/workspace-items/components/folder-sidebar-menu-item";
import CollectionSidebarMenuItem from "@/features/workspace-items/components/collection-sidebar-menu-item";

interface Props {
  parentFolderId: string | null;
  teamId: string | null;
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
  }, [onEmpty, isEmpty, items]);

  useEffect(() => {
    if (workspaceId) {
      refetch().catch((error) =>
        console.error(`Error refetching getWorkspaceItems`, error),
      );
    }
  }, [workspaceId, refetch]);

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
