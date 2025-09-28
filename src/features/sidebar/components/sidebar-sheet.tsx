import { Sheet, SheetContent } from "@/components/ui/sheet";
import WorkspaceSidebar from "@/features/workspaces/components/sidebar/workspace-sidebar";
import { useSidebarSheet } from "../hooks/use-sidebar-sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const SidebarSheet = () => {
  const { open, onClose } = useSidebarSheet();
  const isMobile = useIsMobile();
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left">
        <WorkspaceSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default SidebarSheet;
