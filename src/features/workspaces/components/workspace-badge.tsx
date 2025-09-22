import type { MembershipPreview, WorkspacePreview } from "@/types/workspace";
import WorkspaceAvatar from "./workspace-avatar";
import { SIZE } from "@/types";

interface Props {
  workspace: WorkspacePreview;
  membership?: MembershipPreview | null;
  children?: React.ReactNode;
}
const WorkspaceBadge = ({ workspace, membership, children }: Props) => {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex flex-row items-center justify-start gap-3">
        <WorkspaceAvatar workspace={workspace} disabled size={SIZE.MEDIUM} />
        <div className="flex flex-1 flex-col justify-center">
          <p className="line-clamp-1 text-lg leading-none font-semibold">
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
