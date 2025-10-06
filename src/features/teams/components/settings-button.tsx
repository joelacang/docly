import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { getTeamAccess, TeamAccess, type MyTeamMembership } from "@/types/team";
import { ChevronDownIcon, SettingsIcon } from "lucide-react";
import TeamDropdownMenu from "./team-dropdown-menu";

interface Props {
  team: MyTeamMembership;
}
const SettingsButton = ({ team }: Props) => {
  const isMobile = useIsMobile();
  const isAdmin = getTeamAccess(team.membership.role) >= TeamAccess.ADMIN;

  return (
    <div>
      {isAdmin && (
        <TeamDropdownMenu team={team.team}>
          <Button>
            <SettingsIcon />
            {!isMobile && "Settings"}
            <ChevronDownIcon />
          </Button>
        </TeamDropdownMenu>
      )}
    </div>
  );
};

export default SettingsButton;
