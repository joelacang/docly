import Centered from "@/components/layout/centered";
import Loading from "@/components/loading";
import AlertMessage from "@/components/messages/alert-message";
import { QueryStateHandler } from "@/components/query-state-handler";
import CollectionSidebarMenuItem from "@/features/workspace-items/components/collection-sidebar-menu-item";
import FolderSidebarMenuItem from "@/features/workspace-items/components/folder-sidebar-menu-item";
import { api } from "@/trpc/react";
import { StarOffIcon } from "lucide-react";

interface Props {
  workspaceId: string;
  teamId: string;
  isEditor?: boolean;
}
const TeamFavoriteList = ({ workspaceId, teamId, isEditor }: Props) => {
  const {
    data: favorites,
    isLoading,
    isError,
    error,
  } = api.favorite.getTeamFavorites.useQuery({ workspaceId, teamId });

  return (
    <QueryStateHandler
      data={favorites}
      isLoading={isLoading}
      isError={isError}
      errorTitle="Error Loading Favorites."
      errorMessage={error?.message ?? "An unknown error occurred."}
      loadingLabel={
        <div className="px-4 py-1">
          <Centered className="py-8">
            <Loading label="Loading Items..." />
          </Centered>
        </div>
      }
    >
      {(favorites) => (
        <div>
          {!favorites.folders.length && !favorites.collections.length ? (
            <div className="rounded-lg border-2 border-dashed">
              <AlertMessage
                title="No Favorites Found."
                description="You have not added any favorites."
                icon={StarOffIcon}
              />
            </div>
          ) : (
            <div>
              {favorites.folders.map((f) => (
                <FolderSidebarMenuItem key={f.id} item={f} />
              ))}
              {favorites.collections.map((c) => (
                <CollectionSidebarMenuItem key={c.id} item={c} />
              ))}
            </div>
          )}
        </div>
      )}
    </QueryStateHandler>
  );
};

export default TeamFavoriteList;
