import UserBadge from "@/features/users/user-badge";
import type { User } from "@/types/user";

interface Props {
  leaders: User[];
}
const TeamLeaderCardSection = ({ leaders }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold">Leader:</p>
      <div className="flex flex-row flex-wrap gap-4">
        {leaders.map((leader) => (
          <UserBadge key={leader.id} user={leader} micro styled />
        ))}
      </div>
    </div>
  );
};

export default TeamLeaderCardSection;
