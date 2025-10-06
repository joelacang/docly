import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { MenuItem } from "@/types";
import { getTeamAccess, TeamAccess, type TeamSummary } from "@/types/team";

import {
  EyeIcon,
  HelpCircleIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "lucide-react";
import { useAddTeamMembersDialog } from "../hooks/use-add-team-members-dialog";
import { useMyTeams } from "@/providers/team-provider";
import { Access } from "@/types/workspace";
import { useConfirmationAlert } from "@/features/confirmation/hooks/use-confirmation-alert";

interface Props {
  team: TeamSummary;
  children: React.ReactNode;
}

const TeamDropdownMenu = ({ team, children }: Props) => {
  const { onOpen } = useConfirmationAlert();
  const { myTeams } = useMyTeams();
  const myMembership = myTeams.find((t) => t.team.id === team.id);
  const myTeamAccess = myMembership
    ? getTeamAccess(myMembership.membership.role)
    : TeamAccess.NO_ACCESS;
  const { currentWorkspace } = useMyWorkspaces();
  const myWorkspaceAccess = currentWorkspace?.access ?? Access.NO_ACCESS;

  const { onOpen: openAddTeamMemberDialog } = useAddTeamMembersDialog();
  const isTeamAdmin =
    myTeamAccess >= TeamAccess.ADMIN || myWorkspaceAccess >= Access.ADMIN;
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
      hidden: !isTeamAdmin,
      action: () => {
        openAddTeamMemberDialog(team);
      },
    },
    {
      id: "edit-team",
      label: "Edit Team",
      hidden:
        myTeamAccess !== TeamAccess.LEADER && myWorkspaceAccess < Access.ADMIN,
      icon: PencilIcon,
    },
    {
      id: "delete-team",
      label: "Delete Team",
      icon: TrashIcon,
      mode: "destructive",
      hidden:
        myTeamAccess !== TeamAccess.LEADER && myWorkspaceAccess < Access.ADMIN,
      action: () => {
        onOpen({
          title: `Are you sure?`,
          message: `Are you sure you want to delete ${team.element.name}? This action will remove all member information and related items, making them no longer accessible.`,
          icon: HelpCircleIcon,
          mode: "destructive",
          enableConfirmation: true,
          action: () => {
            alert(`Confirm clicked`);
          },
          actionLabel: "Delete",
        });
      },
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4 w-64">
        {items.map((item) => (
          <MyDropdownMenuItem key={item.id} item={item} color="workspace" />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamDropdownMenu;
