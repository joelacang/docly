import type { User } from "@/types/user";
import UserAvatar from "./user-avatar";
import { SIZE } from "@/types";
import { cn } from "@/lib/utils";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Colors } from "@/utils/colors";

interface Props {
  user: User;
  children?: React.ReactNode;
  micro?: boolean;
  styled?: boolean;
}

const UserBadge = ({ user, children, micro = false, styled }: Props) => {
  const { currentWorkspace } = useMyWorkspaces();
  const color = Colors[currentWorkspace?.workspace.element.color ?? "BLUE"];
  return (
    <div
      className={cn(
        "flex w-fit flex-row items-center justify-start",
        micro ? "gap-2 py-0.5 pr-4" : "gap-4",
        styled &&
          "rounded-full border border-[_var(--ws-primary)] bg-[_var(--ws-light)] pl-1 dark:bg-[_var(--ws-darkest)]",
      )}
      style={
        {
          "--ws-primary": color.primary,
          "--ws-light": color.light,
          "--ws-darkest": color.darkest,
        } as React.CSSProperties
      }
    >
      <UserAvatar user={user} size={micro ? SIZE.MICRO : SIZE.MEDIUM} />

      <div className="flex flex-col items-start justify-center">
        <p
          className={cn(
            "font-sans leading-none font-semibold",
            micro ? "text-xs" : "text-lg",
          )}
        >
          {user.name}
        </p>
        {!micro && (
          <>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <div>{children}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserBadge;
