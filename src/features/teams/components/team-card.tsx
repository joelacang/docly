import Badge from "@/components/custom/badge";
import type { TeamPreview } from "@/types/team";

import TeamBadge from "./team-badge";
import { teamPrivacyIcon } from "@/utils/icon";
import { MoreHorizontalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type React from "react";
import { Colors } from "@/utils/colors";
import Hint from "@/components/hint";
import TeamLeaderCardSection from "./team-leader-card-section";

interface Props {
  team: TeamPreview;
}

const TeamCard = ({ team }: Props) => {
  const iconDisplay = teamPrivacyIcon[team.privacy];
  const Icon = iconDisplay.icon;
  const iconColors = Colors[iconDisplay.color];
  return (
    <div className="bg-card relative flex w-full cursor-pointer items-start justify-between gap-6 rounded-xl border p-5">
      {/* Left side - User info */}
      <div className="flex w-full flex-1">
        <TeamBadge team={team}>
          {team.leaders.length ? (
            <TeamLeaderCardSection leaders={team.leaders} />
          ) : null}
        </TeamBadge>
      </div>

      {/* Right side - Status, Role, and Actions */}
      <div className="flex flex-shrink-0 flex-row items-center gap-4">
        <div className="w-fit">
          <div className="hidden md:flex">
            <Badge display={iconDisplay}>{team.privacy}</Badge>
          </div>
          <div className="flex md:hidden">
            <Hint tooltip={`${team.privacy} Group`}>
              <div
                className="cursor-pointer rounded-full border border-[_var(--icon-primary)] bg-[_var(--icon-light)] p-2.5 text-[_var(--icon-primary)] dark:bg-[_var(--icon-darkest)] dark:text-[_var(--icon-light)]"
                style={
                  {
                    "--icon-primary": iconColors.primary,
                    "--icon-light": iconColors.light,
                    "--icon-darkest": iconColors.darkest,
                  } as React.CSSProperties
                }
              >
                <Icon className="size-5" />
              </div>
            </Hint>
          </div>
        </div>

        <div className="transform opacity-50 transition-all duration-200 group-hover:scale-105 group-hover:opacity-100">
          <MoreHorizontalIcon />
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
