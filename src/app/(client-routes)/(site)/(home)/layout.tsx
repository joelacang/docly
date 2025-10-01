"use client";

import Dock from "@/features/dock/components/dock";
import Navbar from "@/features/navbar/components/navbar";
import NavbarContent from "@/features/navbar/components/navbar-content";
import { useWorkspaceSidebar } from "@/features/workspaces/hooks/use-workspace-sidebar";
import WorkspaceSidebar from "@/features/workspaces/components/sidebar/workspace-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import SidebarSheet from "@/features/sidebar/components/sidebar-sheet";
import { TeamProvider } from "@/providers/team-provider";
import TeamDialogProvider from "@/providers/team-dialog-provider";

interface Props {
  children: React.ReactNode;
}
const SiteLayout = ({ children }: Props) => {
  const { open } = useWorkspaceSidebar();
  const isMobile = useIsMobile();
  const { currentWorkspace } = useMyWorkspaces();

  return (
    <div className="flex h-svh w-full flex-row">
      {currentWorkspace && (
        <TeamProvider workspaceId={currentWorkspace.workspace.id}>
          <TeamDialogProvider />
          <div
            className={cn(
              open ? "w-80 border-r xl:w-96" : "w-0",
              "hidden overflow-hidden transition-all duration-300 ease-in-out lg:block",
            )}
          >
            <WorkspaceSidebar />
          </div>

          <div className="bg-background flex w-full flex-1 flex-col items-center justify-start">
            <Navbar>
              <NavbarContent />
            </Navbar>
            <div className="flex h-[calc(100vh-40px)] w-full flex-col items-center justify-center overflow-y-auto">
              <div className="container flex h-full w-full flex-col">
                {children}
              </div>
            </div>
          </div>
        </TeamProvider>
      )}
    </div>
  );
};

export default SiteLayout;
