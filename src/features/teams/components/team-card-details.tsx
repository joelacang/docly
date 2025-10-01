import type { TeamMembers } from "@/types/team";
import TeamLeadersCardSection from "./team-leader-card-section";

interface Props {
  team: TeamMembers;
}
const TeamCardDetails = ({ team }: Props) => {
  const leaders = team.members
    .filter((l) => l.membership.role === "Leader")
    .map((l) => l.member);

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground line-clamp-2 text-sm">
        {team.team.element.description}
      </p>
      {leaders.length ? <TeamLeadersCardSection leaders={leaders} /> : null}
    </div>
  );
};

export default TeamCardDetails;
