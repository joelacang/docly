import { cn } from "@/lib/utils";
import { useWorkspaceSidebar } from "../../hooks/use-workspace-sidebar";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import Logo from "@/components/logo";
import { SIZE } from "@/types";
import WorkspaceSidebarHeader from "./header/workspace-sidebar-header";
import WorkspaceSidebarContent from "./workspace-sidebar-content";

const WorkspaceSidebar = () => {
  const { currentWorkspace } = useMyWorkspaces();
  return (
    <div className="bg-sidebar h-full w-full">
      {/* HEADER */}
      <WorkspaceSidebarHeader />
      {currentWorkspace && <WorkspaceSidebarContent />}
    </div>
  );
};

export default WorkspaceSidebar;
