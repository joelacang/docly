"use client";
import { cn } from "@/lib/utils";
import type { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}
const Navbar = ({ children, className, ...props }: Props) => {
  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div
        className={cn("container mx-auto flex w-full items-center", className)}
        {...props}
      >
        {children}
      </div>
    </nav>
  );
};

export default Navbar;
