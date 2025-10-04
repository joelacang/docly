import { useMyWorkspaces } from "@/providers/workspace-provider";
import InputIcon from "@/components/custom/InputIcon";
import { SearchIcon } from "lucide-react";
import TeamDashboardSection from "./content/team/team-dashboard-section";
import TeamSection from "./content/team/teams-section";
import { useMyTeams } from "@/providers/team-provider";

const TeamSidebarContent = () => {
  const { currentWorkspace } = useMyWorkspaces();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="space-y-3 px-2 pt-2">
        <InputIcon
          icon={SearchIcon}
          placeholder={`Search ${currentWorkspace?.workspace.element.name}`}
          className="bg-input"
        />
      </div>

      <div className="flex h-[calc(100vh-150px)] flex-col overflow-y-auto">
        <div className="h-full space-y-6 p-2">
          <TeamDashboardSection />
        </div>
      </div>
    </div>
  );
};

export default TeamSidebarContent;
