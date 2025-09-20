"use client";
import Logo from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { SIZE, type MenuItem } from "@/types";
import DashboardSection from "./dashboard-section";
import { useMyWorkspaces } from "@/providers/workspace-provider";

const AppSidebar = () => {
  return (
    <Sidebar className="">
      <SidebarHeader className="py-4">
        <Logo size={SIZE.LARGE} subtitle />
      </SidebarHeader>
      <SidebarContent>
        <DashboardSection />
      </SidebarContent>
      <SidebarFooter>Footer Here</SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
