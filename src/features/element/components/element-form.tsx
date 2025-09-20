import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FieldLabel from "@/features/form/components/field-label";
import { createElementSchema, type CreateElement } from "@/types/element";
import { zodResolver } from "@hookform/resolvers/zod";
import { ElementAccess, type ElementType } from "@prisma/client";
import { ImageIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useElementFormDialog } from "../hooks/use-element-form-dialog";
import DialogContainer from "@/components/custom/dialog-container";
import ColorPicker from "@/components/custom/color-picker";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import React, { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  type: ElementType;
}

const ElementForm = ({ type }: Props) => {
  const { onClose, onPending, onCompleted } = useElementFormDialog();
  const { mutate: createWorkspace, isPending: isCreatingWorkspace } =
    api.workspace.create.useMutation();
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiUtils = api.useUtils();

  const isPending = isCreatingWorkspace;

  const form = useForm<CreateElement>({
    resolver: zodResolver(createElementSchema),
    defaultValues: {
      name: "",
      description: "",
      access: ElementAccess.Personal,
      type,
      color: "GREEN",
      otherOwnerIds: [],
      avatarUrl: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file?.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (values: CreateElement) => {
    const createElementToast = toast.loading(`Creating ${values.type}...`);
    onPending();
    if (type === "Workspace") {
      createWorkspace(values, {
        onSuccess: (response) => {
          onClose();
          toast.success(`Successfully created workspace`);
          apiUtils.workspace.getMyWorkspaces.setData(undefined, (prev) => {
            if (!prev) return [];

            return [...prev, response];
          });
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onSettled: () => {
          onCompleted();
          toast.dismiss(createElementToast);
        },
      });
    }
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContainer>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabel isRequired>Name:</FieldLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder={`Enter ${type} Name`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabel isRequired={false}>Description:</FieldLabel>
                <FormControl>
                  <Textarea
                    className="h-24"
                    placeholder={`Enter ${type} Description`}
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="access"
              control={form.control}
              render={({ field }) => (
                <FormItem className="">
                  <FieldLabel isRequired>{`${type} Access:`}</FieldLabel>
                  <FormControl>
                    <Select
                      disabled={isPending}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Access" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ElementAccess).map((access) => {
                          if (access === "Admin") return;
                          return (
                            <SelectItem key={access} value={access as string}>
                              {access.toUpperCase()}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="color"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FieldLabel isRequired={false}>Color:</FieldLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value ?? "BLUE"}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="otherOwnerIds"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FieldLabel isRequired={false}>Other Owner/s:</FieldLabel>
                <FormControl>
                  <Input disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-center justify-between rounded-lg border p-2">
            <div className="flex flex-row gap-4">
              {avatar ? (
                <div className="relative aspect-square w-10 overflow-hidden rounded-md">
                  <Image
                    fill
                    className="object-cover"
                    src={avatar}
                    alt="Workspace Temp Avatar"
                  />
                </div>
              ) : (
                <div className="flex size-10 items-center justify-center rounded-md bg-gray-300">
                  <ImageIcon className="size-7 text-gray-500" />
                </div>
              )}

              <FieldLabel>Avatar</FieldLabel>
            </div>
            <Button type="button" variant="blue" onClick={handleSelectClick}>
              Select
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={false}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </DialogContainer>

        <DialogFooter className="pt-4">
          <Button
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="blue"
            disabled={!form.formState.isValid || isPending}
          >
            {isPending ? <Loader2Icon /> : <PlusIcon />}
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ElementForm;
