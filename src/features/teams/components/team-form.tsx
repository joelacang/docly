import ColorPicker from "@/components/custom/color-picker";
import { ReusableForm } from "@/features/form/components/reusable-form";
import type { FormFieldComponent } from "@/types/form";
import { createTeamSchema } from "@/types/team";
import { TeamPrivacy, TeamType } from "@prisma/client";
import type z from "zod";
import { useTeamFormDialog } from "../hooks/use-team-form-dialog";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import ToastMessage from "@/components/custom/toast-message";
import { Mode } from "@/types";
import MemberSearch from "@/features/membership/components/member-search";
import type { MemberOption } from "@/types/member";
import { useState } from "react";
import type { ZodCUID } from "zod";

interface Props {
  workspaceId: string;
}
const TeamForm = ({ workspaceId }: Props) => {
  const { mutate: createTeam, isPending: isCreatingTeam } =
    api.team.create.useMutation();
  const { onPending, onCompleted } = useTeamFormDialog();
  const apiUtils = api.useUtils();
  const isPending = isCreatingTeam;
  const [leaders, setLeaders] = useState<MemberOption[]>([]);

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
      mainOrder: 4,
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
      mainOrder: 4,
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
      mainOrder: 4,
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
        const handleMemberChange = (members: MemberOption[]) => {
          setLeaders(members);
          field.onChange(members.map((m) => m.member.id));
        };

        return (
          <MemberSearch
            workspaceId={workspaceId}
            value={leaders}
            onChange={handleMemberChange}
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
            message={`The team ${response.element.name} has been created successfully.`}
            mode={Mode.SUCCESS}
          />
        ));

        apiUtils.team.getTeams.setData({ workspaceId }, (prev) => {
          if (!prev) return [];

          const updatedTeams = [...prev, response];

          return updatedTeams;
        });
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
          },
        }}
      />
    </>
  );
};

export default TeamForm;
