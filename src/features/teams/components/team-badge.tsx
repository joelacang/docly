import type { TeamSummary } from "@/types/team";
import TeamAvatar from "./team-avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { SIZE } from "@/types";

interface Props {
  team: TeamSummary;
  children?: React.ReactNode;
  disabled?: boolean;
  compact?: boolean;
}
const TeamBadge = ({
  team,
  children,
  disabled = false,
  compact = false,
}: Props) => {
  const { baseUrl } = useMyWorkspaces();

  return (
    <div className="flex flex-row items-start justify-start gap-4">
      <Link
        className={cn(disabled && "pointer-events-none")}
        href={`${baseUrl}/team/${team.element.slug}`}
      >
        <TeamAvatar
          className="cursor-pointer"
          team={team}
          size={compact ? SIZE.SMALL : SIZE.MEDIUM}
        />
      </Link>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-start justify-center">
          <Link
            href={`${baseUrl}/team/${team.element.slug}`}
            className={cn(
              "text-primary line-clamp-2 text-lg font-semibold hover:underline hover:underline-offset-4",
              disabled && "pointer-events-none",
            )}
          >
            {team.element.name}
          </Link>
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
