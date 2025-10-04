import type { MembershipPreview, WorkspacePreview } from "@/types/workspace";
import WorkspaceAvatar from "./workspace-avatar";
import { SIZE } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  workspace: WorkspacePreview;
  membership?: MembershipPreview | null;
  children?: React.ReactNode;
  compact?: boolean;
}
const WorkspaceBadge = ({
  workspace,
  membership,
  children,
  compact,
}: Props) => {
  return (
    <div className={cn("flex items-center justify-between gap-4")}>
      <div className="flex flex-row items-center justify-start gap-3">
        <WorkspaceAvatar
          workspace={workspace}
          size={compact ? SIZE.MICRO : SIZE.MEDIUM}
        />
        <div className="flex flex-1 flex-col justify-center">
          <p
            className={cn(
              "line-clamp-1 w-full leading-none font-semibold",
              compact ? "max-w-28 text-sm" : "text-lg",
            )}
          >
            {workspace.element.name}
          </p>
          {membership && (
            <p className="text-muted-foreground text-sm">{membership.role}</p>
          )}
        </div>
      </div>
      <div className="flex size-fit items-center justify-end">{children}</div>
    </div>
  );
};

export default WorkspaceBadge;
