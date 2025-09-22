import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { SIZE } from "@/types";
import type { User } from "@/types/user";
import { getAvatarSize, getAvatarText } from "@/utils/sizes";

interface Props {
  size?: SIZE;
  user: User;
}

const UserAvatar = ({ user, size = SIZE.MEDIUM }: Props) => {
  const currentSize = getAvatarSize(size);
  const currentTextSize = getAvatarText(size);
  return (
    <Avatar className={cn(currentSize, "cursor-pointer")}>
      <AvatarImage />
      <AvatarFallback
        className={cn(
          "bg-gradient-to-b from-blue-400 to-blue-600 font-semibold text-white",
          currentTextSize,
        )}
      >
        {user.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
