import { Mode } from "@/types";
import Centered from "../layout/centered";
import { getModeIcon } from "@/utils/icon";
import { Colors, getModeColor } from "@/utils/colors";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  mode?: Mode;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  dashed?: boolean;
}

const AlertMessage = ({
  title,
  description,
  mode = Mode.DEFAULT,
  icon,
  children,
  dashed = false,
  className,
}: Props) => {
  const Icon = icon ?? getModeIcon(mode);
  const color = Colors[getModeColor(mode)].primary;
  return (
    <div
      className={cn(
        "flex max-w-sm flex-col items-center justify-center gap-4 rounded-lg py-8",
        className,
        dashed && "border-3 border-dashed",
      )}
    >
      <Icon className="size-10" color={color} />
      <div>
        <p
          className="text-center text-lg leading-relaxed font-semibold"
          style={{ color }}
        >
          {title}
        </p>
        <p className="text-center text-sm" style={{ color }}>
          {description}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AlertMessage;
