import PageHeader from "@/features/pages/page-header";
import { SIZE } from "@/types";
import type {
  TeamAccess,
  TeamMemberProfile,
  TeamMembershipDetails,
  TeamSummary,
} from "@/types/team";
import TeamAvatar from "./team-avatar";
import Badge from "@/components/custom/badge";
import { teamTypeIcon } from "@/utils/icon";

interface Props {
  team: TeamSummary;
  membershipInfo?: TeamMembershipDetails;
  access?: TeamAccess;
  settings?: React.ReactNode | null;
}
const TeamPageHeader = ({ team, membershipInfo, access, settings }: Props) => {
  return (
    <PageHeader
      title={team.element.name}
      subtitle={team.element.description ?? ""}
      icon={<TeamAvatar team={team} size={SIZE.LARGE} />}
      settings={settings}
    >
      <div className="flex flex-row items-center gap-4 py-2">
        <p className="text-muted-foreground">
          <span className="text-primary font-semibold">
            {team.membersCount}
          </span>{" "}
          members
        </p>
        <Badge display={teamTypeIcon[team.type]}>{team.type}</Badge>
      </div>
    </PageHeader>
  );
};

export default TeamPageHeader;
