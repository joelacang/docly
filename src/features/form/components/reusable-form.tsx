/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { CustomFormProps, FormFieldComponent } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type ControllerRenderProps,
  type Path,
} from "react-hook-form";
import type z from "zod";
import FieldLabel from "./field-label";
import InputIcon from "@/components/custom/InputIcon";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ReusableForm<TSchema extends z.ZodObject<any>>({
  props,
  children,
}: {
  props: CustomFormProps<TSchema>;
  children?: React.ReactNode;
}) {
  const {
    fields,
    schema,
    onSubmit,
    submitText,
    defaultValues,
    className = "",
    showErrors = true,
    isPending = false,
    submitTextPending = "Submitting...",
  } = props;

  const renderField = ({
    field,
    component,
  }: {
    field: ControllerRenderProps<
      z.infer<TSchema>,
      Path<z.core.output<TSchema>>
    >;
    component: FormFieldComponent<TSchema>;
  }) => {
    const errors = form.formState.errors[component.name];

    return (
      <FormItem>
        <FieldLabel isRequired={component.isRequired}>
          {component.label}
        </FieldLabel>
        <FormControl>
          {(() => {
            switch (component.component) {
              case "input":
                return (
                  <div>
                    {component.icon ? (
                      <InputIcon
                        icon={component.icon}
                        id={component.name}
                        disabled={isPending}
                        className={component.className}
                        value={(field.value as string) ?? ""}
                        onChange={field.onChange}
                        {...component.inputProps}
                        required={Boolean(component.isRequired)}
                      />
                    ) : (
                      <Input
                        id={component.name}
                        disabled={isPending}
                        className={component.className}
                        value={(field.value as string) ?? ""}
                        onChange={field.onChange}
                        {...component.inputProps}
                        required={Boolean(component.isRequired)}
                      />
                    )}
                  </div>
                );
              case "textarea":
                return (
                  <Textarea
                    id={component.name}
                    className={cn("min-h-24", component.className)}
                    disabled={isPending}
                    required={Boolean(component.isRequired)}
                    value={(field.value as string) ?? ""}
                    onChange={field.onChange}
                    {...component.textareaProps}
                  />
                );
              case "select":
                return (
                  <Select
                    value={(field.value as string) ?? ""}
                    onValueChange={field.onChange}
                    disabled={isPending}
                    required={Boolean(component.isRequired)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className={cn("min-w-44", component.className)}
                    >
                      {component.options.map((option) => (
                        <SelectItem
                          className="line-clamp-1"
                          key={option.value}
                          value={option.value}
                        >
                          {option.content ?? option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              case "custom":
                return component.render(field);
            }
          })()}
        </FormControl>
        {showErrors && errors?.message && (
          <div>
            <FormMessage />
          </div>
        )}
      </FormItem>
    );
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: "onBlur",
  });

  const fieldComponents = fields.slice().sort((a, b) => {
    if (a.mainOrder !== b.mainOrder) {
      return a.mainOrder - b.mainOrder;
    }

    return (a.childOrder ?? 0) - (b.childOrder ?? 0);
  });

  // Group by mainOrder after sorting
  const groupedFields = fieldComponents.reduce<Record<number, typeof fields>>(
    (acc, field) => {
      acc[field.mainOrder] ??= [];
      acc[field.mainOrder]?.push(field);
      return acc;
    },
    {},
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
        <div className="flex flex-1 flex-col space-y-6">
          {Object.entries(groupedFields).map(([mainOrder, group]) => {
            const cols = group.length;
            return (
              <div
                key={mainOrder}
                className={cn(
                  cols > 1 ? "grid grid-cols-2 gap-6" : "flex w-full",
                )}
              >
                {group.map((component) => (
                  <div className="w-full px-0.5" key={component.name}>
                    <FormField
                      name={component.name}
                      control={form.control}
                      render={({ field }) => renderField({ field, component })}
                    />
                  </div>
                ))}
              </div>
            );
          })}
          <div>{children}</div>
          {/* Uncomment this to check schema values */}
          <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
        </div>

        <div className="flex w-full items-center justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="mr-2 animate-spin" />}
            {isPending ? submitTextPending : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
