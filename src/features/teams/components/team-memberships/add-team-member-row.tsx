import type { SearchOption } from "@/types";
import type { addTeamMembersSchema, TeamMemberFormData } from "@/types/team";
import type { User } from "@/types/user";
import type { TeamRole } from "@prisma/client";
import type { ControllerRenderProps, Path } from "react-hook-form";
import type z from "zod";
import AddTeamMemberForm from "./add-team-member-form";

interface Props {
  memberToAdd: TeamMemberFormData;
  field: ControllerRenderProps<
    z.infer<typeof addTeamMembersSchema>,
    "userIdsToAdd"
  >;
  workspaceId: string;
  teamId: string;
  onUserChange: (user: SearchOption<User> | null, tempId: string) => void;
  onRoleChange: (role: TeamRole, tempId: string) => void;
  onRemoveUser: (tempId: string) => void;
}

const AddTeamMemberRow = ({
  memberToAdd,
  field,
  workspaceId,
  teamId,
  onUserChange,
  onRemoveUser,
  onRoleChange,
}: Props) => {
  const userOption: SearchOption<User> | null = memberToAdd.user
    ? {
        value: memberToAdd.user.id,
        label: memberToAdd.user.name,
        data: memberToAdd.user,
      }
    : null;

  const handleUserChange = (
    user: SearchOption<User> | null,
    tempId: string,
  ) => {
    const updated = field.value
      .map((u) => {
        if (u.tempId !== tempId) return u;

        if (user) {
          return {
            ...u,
            userId: user.data.id,
          };
        } else {
          return null;
        }
      })
      .filter(Boolean);

    field.onChange(updated);
    onUserChange(user, tempId);
  };

  const handleRoleChange = (role: TeamRole, tempId: string) => {
    onRoleChange(role, tempId);
    field.onChange();
  };

  const handleRemoveUser = (tempId: string) => {
    onRemoveUser(tempId);
    field.onChange();
  };

  return (
    <AddTeamMemberForm
      workspaceId={workspaceId}
      teamId={teamId}
      value={userOption}
      role={memberToAdd.role}
      tempId={memberToAdd.tempId}
      onChange={(option) => handleUserChange(option, memberToAdd.tempId)}
      onRoleChange={(role) => handleRoleChange(role, memberToAdd.tempId)}
      onRemoveUser={handleRemoveUser}
    />
  );
};

export default AddTeamMemberRow;
