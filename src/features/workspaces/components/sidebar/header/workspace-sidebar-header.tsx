import { SIZE } from "@/types";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import Logo from "@/components/logo";
import WorkspaceBadge from "../../workspace-badge";
import { ChevronDown } from "lucide-react";

const WorkspaceSidebarHeader = () => {
  const { currentWorkspace } = useMyWorkspaces();
  return (
    <div className="flex flex-row border-b p-4">
      {currentWorkspace ? (
        <div className="flex items-center justify-between gap-4">
          <WorkspaceBadge workspace={currentWorkspace.workspace} />
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
