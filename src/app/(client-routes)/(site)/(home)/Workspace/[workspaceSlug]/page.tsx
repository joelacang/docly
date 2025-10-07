"use client";

import ErrorMessage from "@/components/messages/error-message";
import WorkspaceLoader from "@/features/workspaces/components/workspace-loader";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { useParams } from "next/navigation";

const WorkspaceLoadingPage = () => {
  const { currentWorkspace, myWorkspaces } = useMyWorkspaces();
  const { workspaceSlug } = useParams();

  const found = myWorkspaces.find(
    (w) => w.workspace.element.slug === workspaceSlug,
  );

  if (!workspaceSlug) {
    return <ErrorMessage message="Can't load workspace. No slug." />;
  }

  if (found) {
    return (
      <div>
        <pre>{JSON.stringify(currentWorkspace, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <WorkspaceLoader slug={workspaceSlug.toString()} />
    </div>
  );
};

export default WorkspaceLoadingPage;
