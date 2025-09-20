import { cn } from "@/lib/utils";
import { useWorkspaceSidebar } from "../../hooks/use-workspace-sidebar";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import Logo from "@/components/logo";
import { SIZE } from "@/types";
import WorkspaceSidebarHeader from "./header/workspace-sidebar-header";
import WorkspaceSidebarContent from "./workspace-sidebar-content";

const WorkspaceSidebar = () => {
  const { open } = useWorkspaceSidebar();
  const { currentWorkspace } = useMyWorkspaces();
  return (
    <div
      className={cn("bg-sidebar min-h-full w-full", open ? "block" : "hidden")}
      style={{
        borderRightColor: "#E2E8F0",
      }}
    >
      {/* HEADER */}
      <WorkspaceSidebarHeader />
      {currentWorkspace && <WorkspaceSidebarContent />}
    </div>
  );
};

export default WorkspaceSidebar;
