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
    <SidebarSection name="DASHBOARD" icon={LayoutDashboardIcon} items={items} />
  );
};

export default DashboardSection;
