"use client";
import Hint from "@/components/hint";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import MembersTable from "@/features/membership/components/table/members-table";
import PageHeader from "@/features/pages/page-header";
import TeamsTable from "@/features/teams/components/table/teams-table";
import { useTeamFormDialog } from "@/features/teams/hooks/use-team-form-dialog";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const MembershipHomePage = () => {
  const { mode } = useParams();
  const { currentWorkspace } = useMyWorkspaces();
  const router = useRouter();
  const { onOpen: openTeamForm } = useTeamFormDialog();

  if (!currentWorkspace) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="@container">
      {mode === "members" && (
        <div>
          <PageHeader
            title="Workspace Memberships"
            subtitle="Browse, search, and filter through all organization members"
          >
            <Hint tooltip="Add Member">
              <Button variant="blue">
                <PlusIcon />
                <p className="hidden @3xl:block">Add Member</p>
              </Button>
            </Hint>
          </PageHeader>

          <MembersTable workspaceId={currentWorkspace.workspace.id} />
        </div>
      )}
      {mode === "teams" && (
        <div>
          <PageHeader
            title="Workspace Teams"
            subtitle="Browse, search, and filter through all organization members"
          >
            <Hint tooltip="Add Member">
              <Button variant="blue" onClick={openTeamForm}>
                <PlusIcon />
                <p className="hidden lg:block">Add Team</p>
              </Button>
            </Hint>
          </PageHeader>

          <TeamsTable workspaceId={currentWorkspace.workspace.id} />
        </div>
      )}
    </div>
  );
};

export default MembershipHomePage;
