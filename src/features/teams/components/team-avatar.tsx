import { cn } from "@/lib/utils";
import { SIZE } from "@/types";
import type { TeamPreview } from "@/types/team";
import { Colors } from "@/utils/colors";
import { getAvatarSize, getAvatarText } from "@/utils/sizes";
import { useRouter } from "next/navigation";

interface Props {
  team: TeamPreview;
  size?: SIZE;
  disabled?: boolean;
}

const TeamAvatar = ({ team, size = SIZE.MEDIUM, disabled = false }: Props) => {
  const avatarSize = getAvatarSize(size);
  const textSize = getAvatarText(size);
  const color = Colors[team.element.color];
  const router = useRouter();
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl transition-all duration-300",
        avatarSize,
      )}
      style={{
        backgroundImage: `linear-gradient(to bottom, ${color.primary}, ${color.dark})`,
      }}
    >
      <p className={cn(textSize, "font-sans font-bold text-white")}>
        {team.element.name.charAt(0).toUpperCase()}
      </p>
    </div>
  );
};

export default TeamAvatar;
