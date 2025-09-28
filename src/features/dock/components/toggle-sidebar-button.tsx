import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useSidebarSheet } from "@/features/sidebar/hooks/use-sidebar-sheet";
import { useWorkspaceSidebar } from "@/features/workspaces/hooks/use-workspace-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarIcon } from "lucide-react";

const ToggleSidebarButton = () => {
  const { onToggle: toggleSidebar, open: isSidebarOpen } =
    useWorkspaceSidebar();
  const { onToggle: toggleSheet, open: isSidebarSheetOpen } = useSidebarSheet();
  const isMobile = useIsMobile();
  const tooltip = isMobile
    ? isSidebarSheetOpen
      ? "Close Sidebar Sheet"
      : "Open Sidebar Sheet"
    : isSidebarOpen
      ? "Close Sidebar"
      : "Open Sidebar";
  return (
    <Hint tooltip={tooltip} side="right">
      <Button
        className="p-1 hover:bg-transparent"
        variant="ghost"
        onClick={() => {
          if (isMobile) {
            toggleSheet();
          } else {
            toggleSidebar();
          }
        }}
      >
        <SidebarIcon className="size-4" />
      </Button>
    </Hint>
  );
};

export default ToggleSidebarButton;
