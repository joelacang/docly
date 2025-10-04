import { cn } from "@/lib/utils";
import { SIZE } from "@/types";
import type { TeamSummary } from "@/types/team";
import { Colors } from "@/utils/colors";
import { getAvatarSize, getAvatarText } from "@/utils/sizes";
import { useRouter } from "next/navigation";

interface Props {
  team: TeamSummary;
  size?: SIZE;
  disabled?: boolean;
  className?: string;
}

const TeamAvatar = ({
  team,
  size = SIZE.MEDIUM,
  disabled = false,
  className,
}: Props) => {
  const avatarSize = getAvatarSize(size);
  const textSize = getAvatarText(size);
  const color = Colors[team.element.color];
  const router = useRouter();
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center transition-all duration-300",
        size === SIZE.MICRO
          ? "rounded-sm"
          : SIZE.SMALL
            ? "rounded-md"
            : "rounded-xl",
        avatarSize,
        className,
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
