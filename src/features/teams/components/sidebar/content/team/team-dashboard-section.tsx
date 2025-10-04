import type { MenuItem } from "@/types";
import {
  HomeIcon,
  LayoutDashboardIcon,
  ListIcon,
  SettingsIcon,
  UserCogIcon,
} from "lucide-react";
import SidebarSection from "../sidebar-section";
import { usePathname, useRouter } from "next/navigation";
import SidebarMenuButton from "@/features/sidebar/components/sidebar-menu-button";
import { useMyTeams } from "@/providers/team-provider";

const TeamDashboardSection = () => {
  const { baseTeamUrl } = useMyTeams();
  const router = useRouter();
  const pathname = usePathname();

  const items: MenuItem[] = [
    {
      id: "home",
      label: "Team Home",
      icon: HomeIcon,
      highlighted: pathname === baseTeamUrl,
      action: () => {
        router.push(`${baseTeamUrl}`);
      },
    },
    {
      id: "workspace-items",
      label: "All Team Items",
      icon: ListIcon,
      highlighted: pathname === `${baseTeamUrl}/items`,
      action: () => {
        router.push(`${baseTeamUrl}/items`);
      },
    },
    {
      id: "memberships",
      label: "Team Members",
      icon: UserCogIcon,
      highlighted: pathname === `${baseTeamUrl}/memberships`,
      action: () => {
        router.push(`${baseTeamUrl}/memberships`);
      },
    },
    {
      id: "settings",
      label: "Team Settings",
      icon: SettingsIcon,
      highlighted: pathname === `${baseTeamUrl}/settings`,
      action: () => {
        router.push(`${baseTeamUrl}/settings`);
      },
    },
  ];
  return (
    <SidebarSection name="DASHBOARD" icon={LayoutDashboardIcon} color="PURPLE">
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarMenuButton
            key={item.id}
            item={item}
            highlighted={item.highlighted}
          />
        ))}
      </div>
    </SidebarSection>
  );
};

export default TeamDashboardSection;
