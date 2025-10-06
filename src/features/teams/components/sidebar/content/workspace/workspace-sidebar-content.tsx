import { useMyWorkspaces } from "@/providers/workspace-provider";
import TeamDashboardSection from "../team/team-dashboard-section";
import { useMyTeams } from "@/providers/team-provider";
import NoTeamsMessage from "../../../no-teams-message";

const WorkspaceSidebarContent = () => {
  const { currentWorkspace } = useMyWorkspaces();
  const { myTeams } = useMyTeams();

  if (!currentWorkspace) return null;

  return (
    <div className="space-y-6 p-4">{!myTeams.length && <NoTeamsMessage />}</div>
  );
};

export default WorkspaceSidebarContent;
