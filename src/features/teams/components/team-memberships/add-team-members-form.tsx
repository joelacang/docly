import type { FormFieldComponent } from "@/types/form";
import { useAddTeamMembersDialog } from "../../hooks/use-add-team-members-dialog";
import AddTeamMemberForm from "./add-team-member-form";
import {
  addTeamMembersSchema,
  type TeamMemberFormData,
  type TeamSummary,
} from "@/types/team";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@/types/user";
import { Mode, type SearchOption } from "@/types";
import type { TeamRole } from "@prisma/client";
import { ReusableForm } from "@/features/form/components/reusable-form";
import type z from "zod";
import { generateId } from "@/server/helper-functions";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import LoadingToastMessage from "@/components/custom/loading-toast-message";
import ToastMessage from "@/components/custom/toast-message";
import { useMyTeams } from "@/providers/team-provider";
import { useAuth } from "@/providers/auth-provider";

interface Props {
  team: TeamSummary;
  workspaceId: string;
}

const AddTeamMembersForm = ({ team, workspaceId }: Props) => {
  const { onPending, onCompleted, onClose } = useAddTeamMembersDialog();
  const { mutate: addTeamMembers, isPending: isAddingMembers } =
    api.teamMembership.addTeamMembers.useMutation();
  const [membersToAdd, setMembersToAdd] = useState<TeamMemberFormData[]>([]);
  const apiUtils = api.useUtils();
  const { loggedUser } = useAuth();

  useEffect(() => {
    if (membersToAdd.length > 0) return;

    setMembersToAdd([
      {
        tempId: generateId(8),
        user: null,
        role: "Member",
      },
    ]);
  }, [membersToAdd.length]);

  const fields: FormFieldComponent<typeof addTeamMembersSchema>[] = [
    {
      component: "custom",
      name: "userIdsToAdd",
      label: "Add Members",
      mainOrder: 1,
      isRequired: true,
      render: (field) => {
        const handleUserChange = (
          user: SearchOption<User> | null,
          tempId: string,
        ) => {
          setMembersToAdd((prev) => {
            const updated = prev.map((u) => {
              if (u.tempId !== tempId) return u;

              if (user) {
                return {
                  ...u,
                  user: user.data,
                };
              } else {
                return {
                  ...u,
                  user: null,
                };
              }
            });

            setTimeout(() => {
              field.onChange(
                updated.map((u) => ({
                  tempId: u.tempId,
                  userId: u.user?.id,
                  role: u.role,
                })),
              );
            }, 0);

            return updated;
          });
        };

        const handleRoleChange = (role: TeamRole, tempId: string) => {
          setMembersToAdd((prev) => {
            const updated = prev.map((u) => {
              if (u.tempId !== tempId) return u;

              // update role for matching tempId
              return {
                ...u,
                role,
              };
            });

            setTimeout(() => {
              field.onChange(
                updated.map((u) => ({
                  tempId: tempId,
                  userId: u.user?.id,
                  role: u.role,
                })),
              );
            }, 0);

            return updated;
          });
        };

        const handleRemoveUser = (tempId: string) => {
          setMembersToAdd((prev) => {
            const updated = prev.filter((u) => u.tempId !== tempId);

            setTimeout(() => {
              field.onChange(
                updated.map((u) => ({
                  tempId: u.tempId,
                  userId: u.user?.id,
                  role: u.role,
                })),
              );
            }, 0);

            return updated;
          });
        };

        return (
          <div className="flex w-full flex-col space-y-4">
            {membersToAdd.map((userToAdd) => (
              <div key={userToAdd.tempId}>
                <AddTeamMemberForm
                  workspaceId={workspaceId}
                  teamId={team.id}
                  value={
                    userToAdd.user
                      ? {
                          value: userToAdd.user.id,
                          label: userToAdd.user.name,
                          data: userToAdd.user,
                        }
                      : null
                  }
                  role={userToAdd.role}
                  tempId={userToAdd.tempId}
                  onChange={(option) =>
                    handleUserChange(option, userToAdd.tempId)
                  }
                  onRoleChange={(role) =>
                    handleRoleChange(role, userToAdd.tempId)
                  }
                  onRemoveUser={handleRemoveUser}
                />
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  const onSubmit = (values: z.infer<typeof addTeamMembersSchema>) => {
    console.log(values);

    const addMembersToast = toast.custom(() => (
      <LoadingToastMessage message="Adding Team Members..." />
    ));
    onPending();

    addTeamMembers(values, {
      onSuccess: (response) => {
        const names = response.map((m) => m.member.name).join(", ");
        const plural = response.length > 1;

        toast.custom(() => (
          <ToastMessage
            title="Team Members Added Successfully."
            message={`Team member${plural ? "s" : ""}: ${names} ${plural ? "have" : "has"} been added to the team "${team.element.name}".`}
          />
        ));

        apiUtils.team.getMyTeams.setData({ workspaceId }, (prev) => {
          if (!prev) return [];

          const myNewMembership = response.find(
            (m) => m.member.id === loggedUser.id,
          );

          const updated = myNewMembership
            ? [
                ...prev,
                {
                  team,
                  membership: myNewMembership.membership,
                },
              ]
            : prev;

          return updated;
        });

        apiUtils.team.getTeams
          .invalidate()
          .then(() => console.log(`getTeams invalidated`))
          .catch((error) =>
            console.error(`Error invalidating getTeams`, error),
          );

        onClose();
      },
      onError: (error) => {
        toast.custom(() => (
          <ToastMessage
            title="Error Adding Team Members"
            message={error.message ?? "An unknown error occurred."}
            mode={Mode.ERROR}
          />
        ));
      },
      onSettled: () => {
        toast.dismiss(addMembersToast);
        onCompleted();
      },
    });
  };

  return (
    <div>
      <div className="flex w-full items-center justify-end">
        <Button
          onClick={() => {
            setMembersToAdd((prev) => [
              ...prev,
              {
                tempId: generateId(8),
                user: null,
                role: "Member",
              },
            ]);
          }}
        >
          <UserPlusIcon />
          Add User
        </Button>
      </div>
      <ReusableForm
        props={{
          schema: addTeamMembersSchema,
          fields,
          onSubmit,
          defaultValues: {
            teamId: team.id,
            workspaceId,
            userIdsToAdd: membersToAdd.map((u) => ({
              tempId: u.tempId,
              role: u.role,
              userId: u.user?.id,
            })),
          },
          submitText: "Add Member",
          submitTextPending: "Adding Member...",
          showErrors: true,
          isPending: isAddingMembers,
        }}
      />
    </div>
  );
};

export default AddTeamMembersForm;
