import { StarIcon } from "lucide-react";

import TeamFavoriteList from "@/features/favorites/components/team-favorite-list";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import SidebarSection from "./sidebar-section";
import { useMyTeams } from "@/providers/team-provider";

const FavoritesSection = () => {
  const { currentWorkspace } = useMyWorkspaces();
  const { currentTeam } = useMyTeams();

  return (
    <SidebarSection name="FAVORITES" icon={StarIcon} color="YELLOW">
      {currentWorkspace && currentTeam && (
        <TeamFavoriteList
          workspaceId={currentWorkspace.workspace.id}
          teamId={currentTeam.team.id}
        />
      )}
    </SidebarSection>
  );
};

export default FavoritesSection;
