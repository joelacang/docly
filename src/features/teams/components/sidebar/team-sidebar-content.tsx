import { useMyWorkspaces } from "@/providers/workspace-provider";
import InputIcon from "@/components/custom/InputIcon";
import { PlusIcon, SearchIcon } from "lucide-react";
import TeamDashboardSection from "./content/team-dashboard-section";
import TeamSection from "./content/teams-section";
import { useMyTeams } from "@/providers/team-provider";
import FavoritesSection from "./content/favorites-section";
import ItemsSection from "./content/team-items-section";
import { Button } from "@/components/ui/button";
import { useAddItemDialog } from "@/features/workspace-items/hooks/use-add-item-dialog";

const TeamSidebarContent = () => {
  const { currentWorkspace } = useMyWorkspaces();
  const { currentTeam } = useMyTeams();
  const { onOpen } = useAddItemDialog();

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
          {currentTeam && (
            <Button
              className="w-full"
              variant="blue"
              onClick={() => onOpen({ teamId: currentTeam.team.id })}
            >
              <PlusIcon />
              Add Item
            </Button>
          )}
          <TeamDashboardSection />
          <FavoritesSection />
          <ItemsSection />
        </div>
      </div>
    </div>
  );
};

export default TeamSidebarContent;
