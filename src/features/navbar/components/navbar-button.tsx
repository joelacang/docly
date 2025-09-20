import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  tooltip: string;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const NavbarButton = ({
  tooltip,
  icon: Icon,
  isActive = false,
  children,
  className,
  ...props
}: Props) => {
  return (
    <Hint tooltip={tooltip}>
      <Button
        type="button"
        className={cn(
          "rounded-full hover:bg-green-50",
          isActive && "bg-green-100",
          className,
        )}
        variant="ghost"
        size="icon"
        {...props}
      >
        <Icon className="text-primary size-5" />
        {children}
      </Button>
    </Hint>
  );
};

export default NavbarButton;
