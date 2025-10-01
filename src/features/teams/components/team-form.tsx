import ColorPicker from "@/components/custom/color-picker";
import { ReusableForm } from "@/features/form/components/reusable-form";
import type { FormFieldComponent } from "@/types/form";
import { createTeamSchema, type MyTeamMembership } from "@/types/team";
import { TeamPrivacy, TeamType } from "@prisma/client";
import type z from "zod";
import { useTeamFormDialog } from "../hooks/use-team-form-dialog";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import ToastMessage from "@/components/custom/toast-message";
import { Mode, type SearchOption } from "@/types";
import type { MemberOption } from "@/types/member";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import MemberSearch from "@/features/search/components/member-search";
import type { User } from "@/types/user";

interface Props {
  workspaceId: string;
}
const TeamForm = ({ workspaceId }: Props) => {
  const { mutate: createTeam, isPending: isCreatingTeam } =
    api.team.create.useMutation();
  const { onPending, onCompleted, onClose } = useTeamFormDialog();
  const apiUtils = api.useUtils();
  const { loggedUser } = useAuth();
  const isPending = isCreatingTeam;
  const [leaders, setLeaders] = useState<SearchOption<User>[]>([]);
  const [members, setMembers] = useState<SearchOption<User>[]>([]);
  const [officers, setOfficers] = useState<SearchOption<User>[]>([]);

  const fields: FormFieldComponent<typeof createTeamSchema>[] = [
    {
      component: "input",
      name: "name",
      label: "Team Name:",
      mainOrder: 1,
      isRequired: true,
      inputProps: {
        placeholder: "Enter Team Name",
      },
    },
    {
      component: "textarea",
      name: "description",
      label: "Team Description:",
      mainOrder: 2,
      isRequired: false,
      textareaProps: {
        placeholder: "Describe the team's purpose, goals, or focus areas...",
      },
    },
    {
      component: "custom",
      name: "color",
      label: "Team Color",
      mainOrder: 6,
      childOrder: 1,
      isRequired: true,
      render: (field) => (
        <ColorPicker value={field.value as string} onChange={field.onChange} />
      ),
    },
    {
      component: "select",
      name: "type",
      label: "Type",
      mainOrder: 6,
      childOrder: 2,
      options: Object.values(TeamType).map((t) => ({
        value: t,
        label: t,
      })),
    },
    {
      component: "select",
      name: "privacy",
      label: "Privacy",
      mainOrder: 6,
      childOrder: 3,
      options: Object.values(TeamPrivacy).map((t) => ({
        value: t,
        label: t,
      })),
    },
    {
      component: "custom",
      name: "leaderIds",
      label: "Leader/s",
      mainOrder: 3,
      render: (field) => {
        const handleLeaderChange = (leadersToUpdate: SearchOption<User>[]) => {
          setLeaders(leadersToUpdate);
          field.onChange(leadersToUpdate.map((m) => m.data.id));
        };

        return (
          <MemberSearch
            workspaceId={workspaceId}
            disabled={isPending}
            placeholder="Enter Leader's Name To Search"
            mode="multiple"
            value={leaders}
            onChange={handleLeaderChange}
          />
        );
      },
    },
    {
      component: "custom",
      name: "officerIds",
      label: "Officer/s",
      mainOrder: 4,
      render: (field) => {
        const handleOfficerChange = (
          officersToUpdate: SearchOption<User>[],
        ) => {
          setOfficers(officersToUpdate);
          field.onChange(officersToUpdate.map((m) => m.data.id));
        };

        return (
          <MemberSearch
            mode="multiple"
            disabled={isPending}
            workspaceId={workspaceId}
            value={officers}
            onChange={handleOfficerChange}
            placeholder="Enter Officer's Name To Search..."
          />
        );
      },
    },
    {
      component: "custom",
      name: "memberIds",
      label: "Member/s",
      mainOrder: 5,
      render: (field) => {
        const handleMemberChange = (membersToUpdate: SearchOption<User>[]) => {
          setMembers(membersToUpdate);
          field.onChange(membersToUpdate.map((m) => m.data.id));
        };

        return (
          <MemberSearch
            mode="multiple"
            disabled={isPending}
            workspaceId={workspaceId}
            value={members}
            onChange={handleMemberChange}
            placeholder="Enter Member's Name To Search..."
          />
        );
      },
    },
  ];

  const onSubmit = (values: z.infer<typeof createTeamSchema>) => {
    const createToast = toast.loading(`Creating Team...`);
    onPending();

    createTeam(values, {
      onSuccess: (response) => {
        toast.custom(() => (
          <ToastMessage
            title="Created Team"
            message={`The team ${response?.team.element.name} has been created successfully.`}
            mode={Mode.SUCCESS}
          />
        ));

        apiUtils.team.getTeams.setData({ workspaceId }, (prev) => {
          if (!prev) return [];

          const updatedTeams = response ? [...prev, response] : prev;

          return updatedTeams;
        });

        apiUtils.team.getMyTeams.setData({ workspaceId }, (prev) => {
          if (!prev) return [];

          if (!response) return prev;

          const profile = response.members?.find(
            (member) => member.member.id === loggedUser.id,
          );

          if (profile) {
            const myUpdatedTeams = [
              ...prev,
              {
                team: response.team,
                membership: profile.membership,
              } satisfies MyTeamMembership,
            ];

            return myUpdatedTeams;
          }

          return prev;
        });
        onClose();
      },

      onError: (error) => {
        toast.custom(() => (
          <ToastMessage
            title="Error creating team"
            message={error.message}
            mode={Mode.ERROR}
          />
        ));
      },
      onSettled: () => {
        toast.dismiss(createToast);
        onCompleted();
      },
    });
  };

  return (
    <>
      <ReusableForm
        props={{
          schema: createTeamSchema,
          fields,
          onSubmit,
          isPending,
          submitText: "Create Team",
          submitTextPending: "Creating Team...",
          defaultValues: {
            name: "",
            description: "",
            color: "BLUE",
            elementType: "Team",
            workspaceId: workspaceId,
            avatarUrl: "",
            type: "Department",
            privacy: "Open",
            leaderIds: [],
            memberIds: [],
            officerIds: [],
          },
        }}
      />
    </>
  );
};

export default TeamForm;
