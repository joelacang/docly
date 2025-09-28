import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { MenuItem } from "@/types";
import type { TeamPreview } from "@/types/team";
import { Colors } from "@/utils/colors";
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  UserCheckIcon,
  UserPlusIcon,
} from "lucide-react";

interface Props {
  team: TeamPreview;
}

const TeamDropdownMenu = ({ team }: Props) => {
  const items: MenuItem[] = [
    {
      id: "view-team",
      label: "View Team",
      icon: EyeIcon,
    },
    {
      id: "add-team-member",
      label: "Add Team Member",
      icon: UserPlusIcon,
    },
    {
      id: "edit-team",
      label: "Edit Team",
      icon: PencilIcon,
    },
    {
      id: "delete-team",
      label: "Delete Team",
      icon: TrashIcon,
      mode: "destructive",
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="" variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4 w-64">
        {items.map((item) => (
          <MyDropdownMenuItem key={item.id} item={item} color="workspace" />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamDropdownMenu;
