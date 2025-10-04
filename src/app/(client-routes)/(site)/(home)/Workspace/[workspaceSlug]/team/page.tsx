"use client";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import PageHeader from "@/features/pages/page-header";
import TeamsTable from "@/features/teams/components/table/teams-table";
import { useTeamFormDialog } from "@/features/teams/hooks/use-team-form-dialog";
import NoWorkspaceMessage from "@/features/workspaces/components/messages/no-workspace-message";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Access } from "@/types/workspace";
import { getWorkspaceAccess } from "@/utils";
import { PlusIcon } from "lucide-react";

const AllTeamsPage = () => {
  const { currentWorkspace } = useMyWorkspaces();
  const myAccess = currentWorkspace
    ? getWorkspaceAccess(currentWorkspace)
    : Access.NO_ACCESS;
  const { onOpen: openTeamForm } = useTeamFormDialog();

  if (!currentWorkspace) {
    return <NoWorkspaceMessage />;
  }

  return (
    <div>
      <PageHeader
        title="Workspace Teams"
        subtitle="Browse, search, and filter through all organization members"
        settings={
          <>
            {myAccess >= Access.ADMIN && (
              <Hint tooltip="Add Member">
                <Button variant="blue" onClick={openTeamForm}>
                  <PlusIcon />
                  <p className="hidden lg:block">Add Team</p>
                </Button>
              </Hint>
            )}
          </>
        }
      ></PageHeader>

      <TeamsTable workspaceId={currentWorkspace.workspace.id} />
    </div>
  );
};

export default AllTeamsPage;
