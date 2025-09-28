import { QueryStateHandler } from "@/components/query-state-handler";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/react";
import { memberColumns } from "./columns";
import MemberCard from "../member-card";

interface Props {
  workspaceId: string;
}

const MembersTable = ({ workspaceId }: Props) => {
  const {
    data: members,
    isLoading,
    isError,
    error,
  } = api.membership.getMembers.useQuery({ workspaceId });

  return (
    <QueryStateHandler
      data={members}
      isLoading={isLoading}
      isError={isError}
      loadingLabel="Loading Members..."
      errorTitle="Error Loading Members"
      errorMessage={error?.message ?? "An unknown error occurred."}
      emptyTitle="No Members Found"
      emptyDescription="No members found on this workspace."
    >
      {(members) => (
        <div className="@container w-full">
          <div className="hidden w-full overflow-auto @3xl:flex">
            <DataTable columns={memberColumns} data={members} />
          </div>
          <div className="flex flex-col gap-4 @3xl:hidden">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}
    </QueryStateHandler>
  );
};

export default MembersTable;
