import { cn } from "@/lib/utils";
import type { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}
const DialogContainer = ({ children, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        "@container max-h-[60vh] space-y-4 overflow-y-auto p-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default DialogContainer;
