import { useMyTeams } from "@/providers/team-provider";
import TeamBadge from "../../team-badge";
import {
  ChevronDownIcon,
  PlusIcon,
  SearchXIcon,
  UserPlusIcon,
  Users2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MyDropdownMenuItem from "@/components/custom/my-dropdown-menu-item";
import Logo from "@/components/logo";
import { Mode, SIZE, type MenuItem } from "@/types";
import TeamAvatar from "../../team-avatar";
import AlertMessage from "@/components/messages/alert-message";
import { Button } from "@/components/ui/button";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { useTeamFormDialog } from "@/features/teams/hooks/use-team-form-dialog";
import { Access } from "@/types/workspace";
import { useRouter } from "next/navigation";

const TeamSidebarHeader = () => {
  const { currentTeam, myTeams, onClearTeam, onSwitchTeam } = useMyTeams();
  const { currentWorkspace, baseUrl } = useMyWorkspaces();
  const { onOpen: addTeamDialog } = useTeamFormDialog();
  const router = useRouter();
  const isWorkspaceAdmin = (currentWorkspace?.access ?? 0) >= Access.ADMIN;

  if (!currentWorkspace) return null;

  const topItems: MenuItem[] = [
    {
      id: "workspace-home",
      label: `Go To ${currentWorkspace.workspace.element.name}`,
      avatar: (
        <WorkspaceAvatar
          workspace={currentWorkspace.workspace}
          size={SIZE.MICRO}
        />
      ),
      action: () => {
        onClearTeam();
        router.push(`${baseUrl}/home`);
      },
    },
    {
      id: "all-teams",
      label: "View All My Teams",
      icon: Users2Icon,
    },
  ];

  return (
    <div>
      {currentTeam ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full cursor-pointer">
            <div className="flex w-full flex-row items-center justify-between border-b p-4">
              {currentTeam && <TeamBadge team={currentTeam?.team} disabled />}
              <ChevronDownIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-4 w-96 p-2">
            <DropdownMenuGroup>
              {topItems.map((item) => (
                <MyDropdownMenuItem key={item.id} item={item} />
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {myTeams.length > 1 ? (
                <>
                  {myTeams.map((team) => {
                    if (team.team.id === currentTeam?.team.id) return;

                    return (
                      <MyDropdownMenuItem
                        key={team.team.id}
                        item={{
                          id: team.team.id,
                          label: team.team.element.name,
                          avatar: <TeamAvatar team={team.team} />,
                          action: () => {
                            if (currentTeam.team.id !== team.team.id)
                              onSwitchTeam(team, true, true);
                          },
                        }}
                      />
                    );
                  })}
                </>
              ) : (
                <div>
                  <AlertMessage
                    title="You don't have other teams."
                    mode={Mode.DEFAULT}
                    icon={SearchXIcon}
                  >
                    <div className="flex w-full flex-row items-center justify-around gap-4 pt-6">
                      {isWorkspaceAdmin && (
                        <Button variant="purple" onClick={addTeamDialog}>
                          <PlusIcon />
                          Add Team
                        </Button>
                      )}
                      <Button variant="blue">
                        <UserPlusIcon />
                        Join Team
                      </Button>
                    </div>
                  </AlertMessage>
                </div>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="border-b py-2">
          <Logo size={SIZE.LARGE} subtitle />
        </div>
      )}
    </div>
  );
};

export default TeamSidebarHeader;
