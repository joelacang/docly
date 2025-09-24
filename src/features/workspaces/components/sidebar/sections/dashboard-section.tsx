import type { MenuItem } from "@/types";
import {
  BellIcon,
  HomeIcon,
  LayoutDashboardIcon,
  ListIcon,
  SettingsIcon,
  Users2Icon,
} from "lucide-react";
import SidebarSection from "./sidebar-section";
import { useRouter } from "next/navigation";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import SidebarMenuButton from "@/features/sidebar/components/sidebar-menu-button";

const DashboardSection = () => {
  const { currentWorkspace } = useMyWorkspaces();
  const router = useRouter();
  const items: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      action: () => {
        if (currentWorkspace) {
          router.push(`/workspace/${currentWorkspace.workspace.element.slug}`);
        }
      },
    },
    {
      id: "workspace-items",
      label: "Workspace Items",
      icon: ListIcon,
      action: () => {
        if (currentWorkspace) {
          router.push(
            `/workspace/${currentWorkspace.workspace.element.slug}/items`,
          );
        }
      },
    },
    {
      id: "memberships",
      label: "Memberships",
      icon: Users2Icon,
      action: () => {
        if (currentWorkspace) {
          router.push(
            `/workspace/${currentWorkspace.workspace.element.slug}/memberships`,
          );
        }
      },
    },
    {
      id: "notification",
      label: "Notifications",
      icon: BellIcon,
      action: () => {
        if (currentWorkspace) {
          router.push(
            `/workspace/${currentWorkspace.workspace.element.slug}/notifications`,
          );
        }
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      action: () => {
        if (currentWorkspace) {
          router.push(
            `/workspace/${currentWorkspace.workspace.element.slug}/settings`,
          );
        }
      },
    },
  ];
  return (
    <SidebarSection name="DASHBOARD" icon={LayoutDashboardIcon}>
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarMenuButton key={item.id} item={item} />
        ))}
      </div>
    </SidebarSection>
  );
};

export default DashboardSection;
