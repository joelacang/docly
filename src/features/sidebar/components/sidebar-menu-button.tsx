import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { MenuItem } from "@/types";
import { Colors } from "@/utils/colors";
import type React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

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
  const iconColor = item.color && Colors[item.color];

  return (
    <div
      className="group flex w-full items-center justify-between gap-2"
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
              className="size-5 shrink-0 group-hover:text-white"
              strokeWidth={1.5}
              color={iconColor?.primary}
              fill={iconColor?.lightest ?? "none"}
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
