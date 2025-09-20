import type { WorkspacePreview } from "@/types/workspace";
import WorkspaceAvatar from "./workspace-avatar";
import { SIZE } from "@/types";

interface Props {
  workspace: WorkspacePreview;
  children?: React.ReactNode;
}
const WorkspaceBadge = ({ workspace, children }: Props) => {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex flex-row items-center justify-start gap-3">
        <WorkspaceAvatar workspace={workspace} disabled size={SIZE.MEDIUM} />
        <div className="flex flex-1 flex-col justify-center">
          <p className="line-clamp-1 text-lg leading-none font-semibold">
            {workspace.element.name}
          </p>
          <p className="text-muted-foreground text-sm">
            {workspace.element.access}
          </p>
        </div>
      </div>
      <div className="flex size-fit items-center justify-end">{children}</div>
    </div>
  );
};

export default WorkspaceBadge;
