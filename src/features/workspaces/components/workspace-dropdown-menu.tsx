import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WorkspaceBadge from "./workspace-badge";
import {
  BellIcon,
  ChevronDownIcon,
  HomeIcon,
  ListIcon,
  SettingsIcon,
  UserCogIcon,
} from "lucide-react";
import type { WorkspaceMembership } from "@/types/workspace";
import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import type { MenuItem } from "@/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useMyWorkspaces } from "@/providers/workspace-provider";

interface Props {
  workspace: WorkspaceMembership;
}

const WorkspaceDropdownMenu = ({ workspace }: Props) => {
  const router = useRouter();
  const { baseUrl } = useMyWorkspaces();
  const workspaceMenuItems: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      action: () => router.push(`${baseUrl}/home`),
    },
    {
      id: "workspace-items",
      label: "Workspace Items",
      icon: ListIcon,
    },
    {
      id: "memberships",
      label: "Memberships",
      icon: UserCogIcon,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: BellIcon,
    },
    {
      id: "settings",
      label: "Workspace Settings",
      icon: SettingsIcon,
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "flex max-w-56 items-center justify-between gap-4",
            buttonVariants({ variant: "outline" }),
          )}
        >
          <WorkspaceBadge workspace={workspace.workspace} compact />
          <ChevronDownIcon className="size-5 shrink-0" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4 w-72">
        <DropdownMenuGroup className="p-2">
          <WorkspaceBadge
            workspace={workspace.workspace}
            membership={workspace.membership}
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {workspaceMenuItems.map((item) => (
          <MyDropdownMenuItem key={item.id} item={item} color="workspace" />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceDropdownMenu;
