import type { MenuItem } from "@/types";
import {
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  SettingsIcon,
} from "lucide-react";
import SidebarSection from "./sidebar-section";

const DashboardSection = () => {
  const items: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: InboxIcon,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircleIcon,
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
    },
  ];
  return (
    <SidebarSection name="DASHBOARD" icon={LayoutDashboardIcon} items={items} />
  );
};

export default DashboardSection;
