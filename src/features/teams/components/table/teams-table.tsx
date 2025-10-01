import { QueryStateHandler } from "@/components/query-state-handler";
import { api } from "@/trpc/react";
import TeamCard from "../team-card";
import { DataTable } from "@/components/ui/data-table";
import { teamColumns } from "./team-columns";

interface Props {
  workspaceId: string;
}
const TeamsTable = ({ workspaceId }: Props) => {
  const {
    data: teams,
    isLoading,
    isError,
    error,
  } = api.team.getTeams.useQuery({ workspaceId });

  return (
    <QueryStateHandler
      data={teams}
      isLoading={isLoading}
      isError={isError}
      loadingLabel="Loading Teams..."
      errorTitle="Error Loading Teams"
      errorMessage={error?.message ?? "An unknown error occurred."}
      emptyTitle="No Teams Found"
      emptyDescription="Sorry, no teams found on this workspace."
    >
      {(teams) => (
        <div className="@container w-full space-y-6">
          <div className="px-4">
            <p className="text-lg">
              <span className="text-primary font-semibold">{teams.length}</span>
              &nbsp;&nbsp;active teams found on this workspace.
            </p>
          </div>

          <div className="hidden w-full overflow-auto @3xl:flex">
            <DataTable columns={teamColumns} data={teams} />
          </div>
          <div className="flex flex-col gap-4 @3xl:hidden">
            {teams.map((team) => (
              <TeamCard teamDetails={team} key={team.team.id} />
            ))}
          </div>
        </div>
      )}
    </QueryStateHandler>
  );
};

export default TeamsTable;
