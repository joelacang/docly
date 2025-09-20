import { QueryStateHandler } from "@/components/query-state-handler";
import { api } from "@/trpc/react";
import WorkspaceBadge from "../../../workspaces/components/workspace-badge";
import SearchResultHeader from "@/components/custom/search-result-header";
import JoinWorkspaceButton from "./join-workspace-button";

interface Props {
  searchValue: string;
}
const JoinWorkspaceSearchResult = ({ searchValue }: Props) => {
  const {
    data: workspaces,
    isLoading,
    isError,
    error,
  } = api.workspace.searchToJoin.useQuery(
    { searchValue },
    { enabled: !!searchValue },
  );
  return (
    <QueryStateHandler
      data={workspaces}
      isLoading={isLoading}
      isError={isError}
      loadingLabel="Searching For Workspaces."
      errorTitle="Error Loading Workspaces."
      errorMessage={error?.message}
      emptyTitle="No Workspaces Found."
      emptyDescription={`No Workspaces found for the name: '${searchValue}'. Please try another search again.`}
    >
      {(workspaces) => (
        <div className="space-y-2 p-4">
          <SearchResultHeader
            count={workspaces.length}
            searchValue={searchValue}
          />
          {workspaces.map((w) => (
            <WorkspaceBadge key={w.id} workspace={w}>
              <JoinWorkspaceButton workspaceId={w.id} />
            </WorkspaceBadge>
          ))}
        </div>
      )}
    </QueryStateHandler>
  );
};

export default JoinWorkspaceSearchResult;
