import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { MenuItem } from "@/types";
import type { MemberPreview } from "@/types/member";
import { Access } from "@/types/workspace";
import { Colors } from "@/utils/colors";
import { MoreHorizontalIcon, PenIcon, UserIcon, XIcon } from "lucide-react";

interface Props {
  member: MemberPreview;
}

const MemberDropdownMenu = ({ member }: Props) => {
  const { currentWorkspace } = useMyWorkspaces();
  const isAdmin =
    currentWorkspace?.access && currentWorkspace?.access >= Access.ADMIN;
  if (!currentWorkspace) return null;
  const items: MenuItem[] = [
    {
      id: "view-member",
      label: "View Member",
      icon: UserIcon,
    },
    {
      id: "change-role",
      label: "Change Role",
      icon: PenIcon,
      hasSeparator: true,
      hidden: !isAdmin,
    },
    {
      id: "remove-member",
      label: "Remove Member",
      icon: XIcon,
      mode: "destructive",
      hidden: !isAdmin,
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4 w-56">
        {items.map((i) => (
          <MyDropdownMenuItem key={i.id} item={i} color="workspace" />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberDropdownMenu;
