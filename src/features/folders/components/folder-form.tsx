import ColorPicker from "@/components/custom/color-picker";
import ToastMessage from "@/components/custom/toast-message";
import { ReusableForm } from "@/features/form/components/reusable-form";
import { api } from "@/trpc/react";
import { Mode } from "@/types";
import { createFolderSchema } from "@/types/folder";
import type { FormFieldComponent } from "@/types/form";
import { Color } from "@prisma/client";
import toast from "react-hot-toast";
import type z from "zod";
import { useFolderFormDialog } from "../hooks/use-folder-form-dialog";

interface Props {
  parentFolderId: string | null;
  workspaceId: string;
  depth: number;
  teamId: string | null;
}
const FolderForm = ({ parentFolderId, workspaceId, depth, teamId }: Props) => {
  const { mutate: createFolder, isPending } = api.folder.create.useMutation();
  const { onPending, onCompleted, onClose } = useFolderFormDialog();
  const apiUtils = api.useUtils();
  const fields: FormFieldComponent<typeof createFolderSchema>[] = [
    {
      component: "input",
      name: "name",
      label: "Name",
      mainOrder: 1,
      isRequired: true,
      inputProps: {
        placeholder: "Enter Folder Name",
        type: "text",
      },
    },
    {
      component: "textarea",
      name: "description",
      label: "Description",
      isRequired: false,
      mainOrder: 2,
      textareaProps: {
        placeholder: "Enter Folder Description",
      },
    },
    {
      component: "custom",
      name: "color",
      label: "Color",
      isRequired: true,
      mainOrder: 3,
      render: (field) => (
        <ColorPicker value={field.value as string} onChange={field.onChange} />
      ),
    },
  ];

  const onSubmit = (values: z.infer<typeof createFolderSchema>) => {
    const createToast = toast.loading(`Creating Folder...`);
    onPending();

    createFolder(values, {
      onSuccess: (response) => {
        toast.custom(() => (
          <ToastMessage
            title="Folder Created"
            message={`The folder ${response.element.name} has been created successfully.`}
            mode={Mode.SUCCESS}
          />
        ));

        apiUtils.folder.getFolderItems
          .invalidate()
          .then(() => console.log(`getFolderItems tag invalidated.`))
          .catch((error) =>
            console.error(`error invalidating getFolderItems tag`, error),
          );

        onClose();
      },
      onError: (error) => {
        toast.custom(() => (
          <ToastMessage
            title="Error creating folder."
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
    <div>
      <ReusableForm
        props={{
          schema: createFolderSchema,
          fields,
          submitText: "Create Folder",
          submitTextPending: "Creating Folder...",
          onSubmit,
          isPending: isPending,
          showErrors: true,
          defaultValues: {
            name: "",
            description: "",
            color: Color.BLUE,
            parentFolderId,
            workspaceId,
            elementType: "Folder",
            depth,
            avatarUrl: "",
            teamId,
          },
        }}
      />
    </div>
  );
};

export default FolderForm;
