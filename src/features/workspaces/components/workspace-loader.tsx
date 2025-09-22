import Centered from "@/components/layout/centered";
import AlertMessage from "@/components/messages/alert-message";
import { QueryStateHandler } from "@/components/query-state-handler";
import JoinWorkspaceButton from "@/features/membership/components/join-workspace/join-workspace-button";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { api } from "@/trpc/react";
import { WorkspaceType } from "@prisma/client";
import { useEffect } from "react";

interface Props {
  slug: string;
}
const WorkspaceLoader = ({ slug }: Props) => {
  const {
    data: workspace,
    isLoading,
    isError,
    error,
  } = api.workspace.getWorkspaceBySlug.useQuery({ slug });

  return (
    <QueryStateHandler
      data={workspace}
      isLoading={isLoading}
      isError={isError}
      loadingLabel="Loading Workspace..."
      errorTitle="Error Loading Workspace"
      errorMessage={error?.message ?? "An unknown error occurred."}
      emptyTitle="Workspace Not Found"
      emptyDescription={`Workspace with a slug of: ${slug} has not been found found. Please try another.`}
    >
      {(workspace) => (
        <div>
          {workspace.workspace.type === WorkspaceType.Private &&
            !workspace.membership && (
              <Centered>
                <AlertMessage
                  title="You are not a member of this workspace"
                  description="This is a Private Workspace and only members are allowed to view it's contents. Click 'Join Now' to join."
                >
                  <JoinWorkspaceButton workspaceId={workspace.workspace.id} />
                </AlertMessage>
              </Centered>
            )}
        </div>
      )}
    </QueryStateHandler>
  );
};

export default WorkspaceLoader;
