import { useMyWorkspaces } from "@/providers/workspace-provider";
import TeamSidebarContent from "./team-sidebar-content";
import TeamSidebarHeader from "./header/team-sidebar-header";
import { useMyTeams } from "@/providers/team-provider";
import WorkspaceSidebarContent from "./content/workspace/workspace-sidebar-content";

const TeamSidebar = () => {
  const { currentTeam } = useMyTeams();
  return (
    <div className="bg-sidebar h-full w-full">
      {/* HEADER */}
      <TeamSidebarHeader />
      {currentTeam ? <TeamSidebarContent /> : <WorkspaceSidebarContent />}
    </div>
  );
};

export default TeamSidebar;
