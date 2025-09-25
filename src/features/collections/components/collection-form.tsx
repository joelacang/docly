import ColorPicker from "@/components/custom/color-picker";
import ToastMessage from "@/components/custom/toast-message";
import { ReusableForm } from "@/features/form/components/reusable-form";
import { api } from "@/trpc/react";
import { Mode } from "@/types";
import { createCollectionSchema } from "@/types/collection";
import type { FormFieldComponent } from "@/types/form";
import { type CollectionType, Color, type ElementType } from "@prisma/client";
import toast from "react-hot-toast";
import type z from "zod";
import { useCollectionFormDialog } from "../hooks/use-collection-form-dialog";

interface Props {
  collectionType: CollectionType;
  workspaceId: string;
  parentFolderId: string | null;
}
const CollectionForm = ({
  collectionType,
  workspaceId,
  parentFolderId,
}: Props) => {
  const { mutate: createCollection, isPending } =
    api.collection.create.useMutation();
  const apiUtils = api.useUtils();
  const { onPending, onCompleted, onClose } = useCollectionFormDialog();
  const fields: FormFieldComponent<typeof createCollectionSchema>[] = [
    {
      component: "input",
      name: "name",
      label: "Name:",
      mainOrder: 1,
      isRequired: true,
      inputProps: {
        placeholder: `Enter ${collectionType} Name`,
      },
    },
    {
      component: "textarea",
      name: "description",
      label: "Description:",
      mainOrder: 2,
      isRequired: false,
      textareaProps: {
        placeholder: `Enter ${collectionType} Name`,
      },
    },
    {
      component: "custom",
      name: "color",
      label: "Color:",
      isRequired: true,
      mainOrder: 3,
      render: (field) => (
        <ColorPicker value={field.value!} onChange={field.onChange} />
      ),
    },
  ];
  const onSubmit = (values: z.infer<typeof createCollectionSchema>) => {
    const createToast = toast.loading(`Creating ${values.collectionType}`);
    onPending();

    createCollection(values, {
      onSuccess: (response) => {
        toast.custom(() => (
          <ToastMessage
            title={`${response.type} Created.`}
            message={`The ${response.type} ${response.element.name} has been created successfully`}
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
            title={`Error creating ${values.collectionType}`}
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

  const defaultValues = {
    name: "",
    description: "",
    color: Color.BLUE,
    parentFolderId,
    workspaceId,
    elementType: "Collection" as ElementType,
    avatarUrl: "",
    collectionType,
  };

  return (
    <div>
      <ReusableForm
        props={{
          schema: createCollectionSchema,
          fields,
          submitText: `Create ${collectionType}`,
          submitTextPending: `Creating ${collectionType}...`,
          onSubmit,
          isPending: isPending,
          showErrors: true,
          defaultValues,
        }}
      />
    </div>
  );
};

export default CollectionForm;
