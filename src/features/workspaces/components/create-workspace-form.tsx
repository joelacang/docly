import AvatarPicker from "@/components/custom/avatar-picker";
import ColorPicker from "@/components/custom/color-picker";
import ToastMessage from "@/components/custom/toast-message";
import { Button } from "@/components/ui/button";
import { ReusableForm } from "@/features/form/components/reusable-form";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { api } from "@/trpc/react";
import { Mode } from "@/types";
import type { FormFieldComponent } from "@/types/form";
import { createWorkspaceSchema } from "@/types/workspace";
import { WorkspaceType } from "@prisma/client";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type z from "zod";
import { useCreateWorkspaceDialog } from "../hooks/create-workspace-dialog";

const CreateWorkspaceForm = () => {
  const { mutate: createWorkspace, isPending } =
    api.workspace.create.useMutation();
  const apiUtils = api.useUtils();
  const router = useRouter();
  const { myWorkspaces } = useMyWorkspaces();
  const { onClose, onPending, onCompleted } = useCreateWorkspaceDialog();
  const fields: FormFieldComponent<typeof createWorkspaceSchema>[] = [
    {
      component: "input",
      name: "name",
      label: "Name:",
      mainOrder: 1,
      isRequired: true,
      inputProps: {
        type: "text",
      },
    },
    {
      component: "textarea",
      name: "description",
      label: "Description:",
      mainOrder: 2,
      isRequired: false,
    },
    {
      component: "select",
      name: "type",
      label: "Workspace Type:",
      mainOrder: 3,
      childOrder: 1,
      isRequired: true,
      options: Object.values(WorkspaceType).map((type) => ({
        value: type,
        label: type,
      })),
    },
    {
      component: "custom",
      name: "color",
      label: "Color:",
      mainOrder: 3,
      childOrder: 2,
      isRequired: true,
      render: (field) => (
        <ColorPicker value={field.value!} onChange={field.onChange} />
      ),
    },
  ];

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    const createToast = toast.loading("Creating Workspace...");
    onPending();
    createWorkspace(values, {
      onSuccess: (response) => {
        toast.custom(() => (
          <ToastMessage
            title={`Workspace ${response.workspace.element.name} created.`}
            message={`You have successfully created the workspace ${response.workspace.element.name}. Click 'Go to Workspace' to start working now.`}
            footer={
              myWorkspaces.length && (
                <Button
                  variant="blue"
                  onClick={() =>
                    router.push(`/workspace/${response.workspace.element.slug}`)
                  }
                >
                  <ArrowRightIcon />
                  Go To Workspace
                </Button>
              )
            }
          />
        ));
        apiUtils.workspace.getMyWorkspaces.setData(undefined, (prev) => {
          if (!prev) return prev;

          const updatedWorkspaces = [...prev.myWorkspaces, response];

          return { ...prev, myWorkspaces: updatedWorkspaces };
        });

        if (!myWorkspaces.length) {
          router.push(`/workspace/${response.workspace.element.slug}`);
        }
        onClose();
      },
      onError: (error) => {
        toast.custom(() => (
          <ToastMessage
            title="Error Creating Workspace"
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
    console.log(values);
  };

  return (
    <ReusableForm
      props={{
        schema: createWorkspaceSchema,
        defaultValues: {
          name: "",
          description: "",
          color: "BLUE",
          avatarUrl: "",
          elementType: "Workspace",
          type: "Personal",
        },
        fields,
        onSubmit,
        submitText: "Create",
        submitTextPending: "Creating...",
        isPending,
      }}
    >
      <AvatarPicker
        onChange={() => {
          alert("Changed");
        }}
      />
    </ReusableForm>
  );
};

export default CreateWorkspaceForm;
