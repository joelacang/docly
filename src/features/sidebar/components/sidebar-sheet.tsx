import { Sheet, SheetContent } from "@/components/ui/sheet";
import TeamSidebar from "@/features/teams/components/sidebar/team-sidebar";
import { useSidebarSheet } from "../hooks/use-sidebar-sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const SidebarSheet = () => {
  const { open, onClose } = useSidebarSheet();
  const isMobile = useIsMobile();
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left">
        <TeamSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default SidebarSheet;
