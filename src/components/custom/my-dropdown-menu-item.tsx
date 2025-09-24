import type { MenuItem } from "@/types";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type React from "react";
import type { ColorPalette } from "@/utils/colors";

interface Props {
  item: MenuItem;
  color?: ColorPalette;
}
const MyDropdownMenuItem = ({ item, color }: Props) => {
  return (
    <div>
      <DropdownMenuItem
        className={cn(
          "flex cursor-pointer items-center justify-between gap-4",
          item.mode === "destructive"
            ? "focus:bg-destructive focus:text-destructive-foreground"
            : color
              ? "focus:bg-[_var(--bg-primary)] focus:text-white dark:focus:bg-[_var(--bg-darkest)]"
              : "focus:bg-accent-neutral",
        )}
        onClick={(e) => {
          if (item.action) {
            e.stopPropagation();
            e.preventDefault();
            item.action();
          }
        }}
        style={
          {
            "--bg-primary": color?.primary ?? "#000",
            "--bg-darkest": color?.darkest ?? "#000",
          } as React.CSSProperties
        }
      >
        <div className="flex flex-row items-center justify-start gap-2">
          {item.icon && (
            <item.icon className="hover:text-accent-foreground !size-5" />
          )}
          <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
        </div>
      </DropdownMenuItem>
      {item.hasSeparator && <DropdownMenuSeparator />}
    </div>
  );
};

export default MyDropdownMenuItem;
