import Centered from "@/components/layout/centered";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import NoWorkspaceMessage from "./messages/no-workspace-message";
import NoCurrentWorkspaceMessage from "./messages/no-current-workspace-message";

const WorkspaceLoader = () => {
  const { myWorkspaces } = useMyWorkspaces();

  if (!myWorkspaces.length) {
    return <NoWorkspaceMessage />;
  }

  return (
    <div>
      <pre>{JSON.stringify(myWorkspaces, null, 2)}</pre>
    </div>
  );
};

export default WorkspaceLoader;
