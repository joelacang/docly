import type { HTMLProps } from "react";
import { cn } from "@/lib/utils";

interface Props extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Centered = ({ children, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Centered;
