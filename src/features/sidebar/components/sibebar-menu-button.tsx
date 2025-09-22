import { Button } from "@/components/ui/button";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { MenuItem } from "@/types";
import { Colors, FOREGROUND_DARK, FOREGROUND_LIGHT } from "@/utils/colors";
import { MoreHorizontalIcon } from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";

interface Props {
  item: MenuItem;
}

const SidebarMenuButton = ({ item }: Props) => {
  const { currentWorkspace } = useMyWorkspaces();
  const { theme } = useTheme();
  const color = Colors[currentWorkspace?.workspace.element.color ?? "GREEN"];
  const iconColor = item.color && Colors[item.color];

  return (
    <div
      className="group peer-[]: flex h-9 w-full cursor-pointer flex-row items-center justify-between rounded-md py-0.5 pl-2 hover:bg-[_var(--ws-primary)] active:bg-[_var(--ws-darkest)] dark:hover:bg-[_var(--ws-darkest)] dark:active:bg-[_var(--ws-dark)]"
      style={
        {
          "--ws-primary": color.primary,
          "--ws-darkest": color.darkest,
          "--ws-dark": color.dark,
        } as React.CSSProperties
      }
      onClick={() => {
        if (item.action) {
          item.action();
        }
      }}
    >
      <div className="flex flex-1 items-center justify-between gap-3 font-medium group-hover:text-white">
        <div className="flex flex-row items-center justify-start gap-3">
          {item.icon && (
            <item.icon
              className="size-5 group-hover:text-white"
              strokeWidth={1.5}
              color={
                iconColor
                  ? iconColor.primary
                  : theme === "light"
                    ? FOREGROUND_LIGHT.lightest
                    : FOREGROUND_DARK.lightest
              }
              fill={iconColor?.lightest ?? "none"}
            />
          )}
          <p className="line-clamp-1 text-base">{item.label}</p>
        </div>
      </div>
      {item.showDropdownButton && (
        <Button
          className="hidden px-3 group-hover:block hover:bg-transparent hover:text-white"
          variant="ghost"
          size="icon"
        >
          <MoreHorizontalIcon className="size-4" />
        </Button>
      )}
    </div>
  );
};

export default SidebarMenuButton;
