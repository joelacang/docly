"use client";

import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import MembersTable from "@/features/membership/components/table/members-table";
import PageHeader from "@/features/pages/page-header";
import NoWorkspaceMessage from "@/features/workspaces/components/messages/no-workspace-message";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Access } from "@/types/workspace";
import { PlusIcon } from "lucide-react";

const MembershipHomePage = () => {
  const { currentWorkspace } = useMyWorkspaces();
  const myAccess = currentWorkspace?.access ?? Access.NO_ACCESS;

  if (!currentWorkspace) {
    return (
      <div>
        <NoWorkspaceMessage />
      </div>
    );
  }

  return (
    <div className="@container">
      <div>
        <PageHeader
          title="Workspace Memberships"
          subtitle="Browse, search, and filter through all organization members"
          settings={
            <>
              {myAccess >= Access.ADMIN && (
                <Hint tooltip="Add Member">
                  <Button variant="blue">
                    <PlusIcon />
                    <p className="hidden @3xl:block">Add Member</p>
                  </Button>
                </Hint>
              )}
            </>
          }
        />

        <MembersTable workspaceId={currentWorkspace.workspace.id} />
      </div>
    </div>
  );
};

export default MembershipHomePage;
