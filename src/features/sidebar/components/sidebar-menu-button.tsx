import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { MenuItem } from "@/types";
import { Colors } from "@/utils/colors";
import type React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useTheme } from "next-themes";

interface Props {
  item: MenuItem;
  isHighlighted?: boolean;
  open?: boolean;
  unlocked?: boolean;
}
const SidebarMenuButton = ({
  item,
  isHighlighted = false,
  open,
  unlocked = false,
}: Props) => {
  const { currentWorkspace } = useMyWorkspaces();
  const color = Colors[currentWorkspace?.workspace.element.color ?? "GREEN"];
  const iconColor = item.color ? Colors[item.color] : Colors.GRAY;
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div
      className="group flex w-full cursor-pointer items-center justify-between gap-2"
      onClick={() => {
        if (item.action) {
          item.action();
        }
      }}
    >
      <div
        className={cn(
          "flex h-9 flex-1 cursor-pointer items-center justify-between rounded-md py-0.5 pr-1 pl-2 transition-colors",
          isHighlighted &&
            "bg-[var(--ws-primary)] text-white dark:bg-[var(--ws-darkest)]",
          "hover:bg-[var(--ws-primary)] hover:text-white hover:dark:bg-[var(--ws-darkest)]",
        )}
        style={
          {
            "--ws-primary": color.primary,
            "--ws-darkest": color.darkest,
          } as React.CSSProperties
        }
      >
        <div className="flex items-center justify-start gap-2">
          {item.icon && (
            <item.icon
              className={cn(
                "size-5 shrink-0",
                item.color
                  ? "text-[_var(--col-primary)]"
                  : "text-foreground group-hover:text-white",
              )}
              style={
                {
                  "--col-primary": iconColor.primary,
                  "--col-darkest": iconColor.darkest,
                } as React.CSSProperties
              }
              strokeWidth={1.5}
              fill={
                item.color
                  ? isDarkMode
                    ? iconColor.darkest
                    : iconColor.lightest
                  : "none"
              }
            />
          )}
          <p className="line-clamp-1 text-base">{item.label}</p>
          {unlocked && (
            <>
              {open ? (
                <ChevronDownIcon className="size-4 opacity-50" />
              ) : (
                <ChevronRightIcon className="size-4 opacity-50" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarMenuButton;
