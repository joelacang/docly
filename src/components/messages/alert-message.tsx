import { Mode } from "@/types";
import Centered from "../layout/centered";
import { getModeIcon } from "@/utils/icon";
import { Colors, getModeColor } from "@/utils/colors";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type React from "react";
import { useTheme } from "next-themes";

interface Props {
  title: string;
  description?: string;
  mode?: Mode;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  dashed?: boolean;
  bgColored?: boolean;
}

const AlertMessage = ({
  title,
  description,
  mode = Mode.DEFAULT,
  icon,
  children,
  dashed = false,
  className,
  bgColored = false,
}: Props) => {
  const Icon = icon ?? getModeIcon(mode);
  const color = Colors[getModeColor(mode)];
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  return (
    <div
      className={cn(
        "flex max-w-sm flex-col items-center justify-center gap-4 rounded-lg py-8",
        className,
        dashed && "border-2 border-dashed border-[_var(--col-primary)] px-4",
        bgColored && "bg-[_var(--col-lightest)] dark:bg-[_var(--col-darkest)]",
      )}
      style={
        {
          "--col-primary": color.primary,
          "--col-lightest": color.lightest,
          "--col-darkest": color.darkest,
        } as React.CSSProperties
      }
    >
      <Icon
        className="size-10"
        color={
          isDarkMode
            ? bgColored
              ? color.lightest
              : color.primary
            : color.primary
        }
      />
      <div>
        <p
          className="text-center text-lg leading-relaxed font-semibold"
          style={{
            color: isDarkMode
              ? bgColored
                ? color.lightest
                : color.primary
              : color.primary,
          }}
        >
          {title}
        </p>
        <p
          className="text-center text-sm"
          style={{
            color: isDarkMode
              ? bgColored
                ? color.lightest
                : color.primary
              : color.primary,
          }}
        >
          {description}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AlertMessage;
