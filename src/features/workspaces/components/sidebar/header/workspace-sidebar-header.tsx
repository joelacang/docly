import { SIZE } from "@/types";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import Logo from "@/components/logo";
import WorkspaceBadge from "../../workspace-badge";
import { ChevronDown } from "lucide-react";

const WorkspaceSidebarHeader = () => {
  const { currentWorkspace } = useMyWorkspaces();
  return (
    <div className="flex w-full flex-row border-b px-4 py-2">
      {currentWorkspace ? (
        <div className="flex w-full items-center justify-between gap-4">
          <WorkspaceBadge
            workspace={currentWorkspace.workspace}
            membership={currentWorkspace.membership}
          />
          <ChevronDown />
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <Logo subtitle size={SIZE.LARGE} />
        </div>
      )}
    </div>
  );
};

export default WorkspaceSidebarHeader;
