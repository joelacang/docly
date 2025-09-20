import { cn } from "@/lib/utils";
import { Mode } from "@/types";
import { Colors, getModeColor } from "@/utils/colors";
import { getModeIcon } from "@/utils/icon";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon?: LucideIcon;
  message?: string;
  mode?: Mode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const ToastMessage = ({
  title,
  icon,
  message,
  mode = Mode.DEFAULT,
  children,
  footer,
}: Props) => {
  const Icon = icon ?? getModeIcon(mode);
  const color = Colors[getModeColor(mode)].primary;

  return (
    <div className="bg-card flex w-full max-w-lg flex-col gap-4 rounded-xl border p-4 shadow-lg">
      <div className="flex flex-row items-start justify-start gap-4">
        <div className="py-2">
          <Icon className="size-12" color={color} />
        </div>

        <div className={cn("flex flex-1 flex-col")}>
          <h4
            className={cn(
              "text-xl font-semibold",
              mode === Mode.ERROR ? "text-destructive" : "text-foreground",
            )}
          >
            {title}
          </h4>
          <p
            className={cn(
              mode === Mode.ERROR
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {message}
          </p>
        </div>
      </div>
      <div className="line-clamp-1 flex w-full items-center justify-center">
        {children}
      </div>

      <div className="flex w-full items-center justify-end">{footer}</div>
    </div>
  );
};

export default ToastMessage;
