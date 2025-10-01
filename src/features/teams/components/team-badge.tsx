import type { TeamSummary } from "@/types/team";
import TeamAvatar from "./team-avatar";
import { cn } from "@/lib/utils";

interface Props {
  team: TeamSummary;
  children?: React.ReactNode;
}
const TeamBadge = ({ team, children }: Props) => {
  return (
    <div className="flex flex-row items-start justify-start gap-4">
      <TeamAvatar team={team} />

      <div className="flex flex-col space-y-2 pt-2">
        <div>
          <p className={cn("line-clamp-2 text-lg leading-none font-semibold")}>
            {team.element.name}
          </p>
          <p className="text-muted-foreground text-sm">
            {team.membersCount} Member{team.membersCount !== 1 ? "s" : ""}
          </p>
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
};

export default TeamBadge;
