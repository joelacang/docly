"use client";
import { EyeIcon, EyeOffIcon, XIcon, type LucideIcon } from "lucide-react";
import { useState, type HTMLProps } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Props extends HTMLProps<HTMLInputElement> {
  icon?: LucideIcon;
  className?: string;
  showPasswordBtn?: boolean;
}

const InputIcon = ({
  icon,
  className,
  showPasswordBtn = false,
  ...props
}: Props) => {
  const Icon = icon ?? XIcon;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        className={cn(
          "h-12 w-full pl-10 font-sans text-sm",
          className,
          showPasswordBtn ? "pr-10" : "pr-4",
        )}
        type={showPasswordBtn ? (showPassword ? "text" : "password") : "text"}
        {...props}
      />
      <div className="border-primary text-muted-foreground absolute top-2.5 left-1.5 rounded-full p-1">
        <Icon className="size-5" />
      </div>
      {showPasswordBtn && (
        <div className="absolute top-1.5 right-1.5">
          <Button
            type="button"
            className="cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOffIcon className="size-5" />
            ) : (
              <EyeIcon className="size-5" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InputIcon;
