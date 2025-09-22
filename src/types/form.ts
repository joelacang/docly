/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import type { HTMLProps } from "react";
import type z from "zod";
import type {
  ControllerRenderProps,
  DefaultValues,
  Path,
} from "react-hook-form";

export type FieldOption = {
  value: string;
  label: string;
  content?: React.ReactNode;
};

export type BaseFormField<TSchema extends z.ZodObject<any>> = {
  name: Path<z.infer<TSchema>>;
  label: string;
  className?: string;
  mainOrder: number;
  childOrder?: number;
  isRequired?: boolean;
};
export type FormFieldInput<TSchema extends z.ZodObject<any>> =
  BaseFormField<TSchema> & {
    component: "input";
    icon?: LucideIcon;
    inputProps?: HTMLProps<HTMLInputElement>;
    content?: React.ReactNode;
  };

export type FormFieldTextarea<TSchema extends z.ZodObject<any>> =
  BaseFormField<TSchema> & {
    component: "textarea";
    textareaProps?: HTMLProps<HTMLTextAreaElement>;
  };

export type FormFieldSelect<TSchema extends z.ZodObject<any>> =
  BaseFormField<TSchema> & {
    component: "select";
    options: FieldOption[];
    selectProps?: HTMLProps<HTMLSelectElement>;
  };

export type FormFieldCustom<TSchema extends z.ZodObject<any>> =
  BaseFormField<TSchema> & {
    component: "custom";
    render: (
      field: ControllerRenderProps<
        z.infer<TSchema>,
        Path<z.core.output<TSchema>>
      >,
    ) => React.ReactNode;
  };

export type FormFieldComponent<TSchema extends z.ZodObject<any>> =
  | FormFieldInput<TSchema>
  | FormFieldTextarea<TSchema>
  | FormFieldSelect<TSchema>
  | FormFieldCustom<TSchema>;

export type CustomFormProps<TSchema extends z.ZodObject<any>> = {
  fields: FormFieldComponent<TSchema>[];
  schema: TSchema;
  onSubmit: (values: z.infer<TSchema>) => void;
  submitText: string;
  submitTextPending?: string;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  className?: string;
  showErrors?: boolean;
  isPending?: boolean;
};
