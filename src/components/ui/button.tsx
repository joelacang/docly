import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-primary/20 hover:text-primary dark:bg-input/30 dark:border-input dark:hover:bg-input/50 text-primary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent-neutral hover:text-accent-neutral-foreground dark:hover:bg-accent-neutral",
        link: "text-primary underline-offset-4 hover:underline",
        green:
          "bg-gradient-to-br from-emerald-400 to-green-600 text-white hover:from-emerald-500 hover:to-green-700 active:from-emerald-600 active:to-green-800 dark:hover:from-emerald-300 dark:hover:to-green-500 dark:active:from-emerald-400 dark:active:to-green-600",
        error:
          "bg-gradient-to-br from-rose-400 to-red-600 text-white hover:from-rose-500 hover:to-red-700 active:from-rose-600 active:to-red-800 dark:hover:from-rose-300 dark:hover:to-red-500 dark:active:from-rose-400 dark:active:to-red-600",
        blue: "bg-gradient-to-br from-sky-400 dark:from-sky-600 to-blue-600 dark:to-blue-800 text-white active:scale-95 hover:from-sky-500 hover:to-blue-700 active:from-sky-600 active:to-blue-800 dark:hover:from-sky-700 dark:hover:to-blue-900 dark:active:from-sky-400 dark:active:to-blue-600 ",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
