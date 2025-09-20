import { Button } from "@/components/ui/button";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { MenuItem } from "@/types";
import { Colors } from "@/utils/colors";
import { MoreHorizontalIcon } from "lucide-react";
import type React from "react";

interface Props {
  item: MenuItem;
}

const SidebarMenuButton = ({ item }: Props) => {
  const { currentWorkspace } = useMyWorkspaces();
  const color = Colors[currentWorkspace?.workspace.element.color ?? "GREEN"];
  const iconColor = Colors[item.color ?? "GREEN"];
  return (
    <div
      className="group peer-[]: flex h-9 w-full cursor-pointer flex-row items-center justify-between rounded-md py-0.5 pl-2 hover:bg-[_var(--ws-primary)] hover:text-white"
      style={
        {
          "--ws-primary": color.primary,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-1 items-center justify-between gap-3 font-medium">
        <div className="flex flex-row items-center justify-start gap-3">
          {item.icon && (
            <item.icon
              className="size-5"
              style={
                {
                  "--icon-color": Colors[item.color ?? "GREEN"].primary,
                } as React.CSSProperties
              }
              fill={iconColor.light}
              color={iconColor.primary}
              strokeWidth={1}
            />
          )}
          <p className="line-clamp-1 text-base">{item.label}</p>
        </div>
      </div>
      <Button
        className="hidden size-fit px-3 group-hover:block hover:bg-transparent hover:text-white"
        variant="ghost"
        size="icon"
      >
        <MoreHorizontalIcon className="size-4" />
      </Button>
    </div>
  );
};

export default SidebarMenuButton;
