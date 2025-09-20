import type { MenuItem } from "@/types";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

interface Props {
  item: MenuItem;
}
const MyDropdownMenuItem = ({ item }: Props) => {
  return (
    <div>
      <DropdownMenuItem
        className="flex cursor-pointer items-center justify-between gap-4"
        onClick={(e) => {
          if (item.action) {
            e.stopPropagation();
            e.preventDefault();
            item.action();
          }
        }}
      >
        <div className="flex flex-row items-center justify-start gap-2">
          {item.icon && <item.icon className="!size-5" />}
          <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
        </div>
      </DropdownMenuItem>
      {item.hasSeparator && <DropdownMenuSeparator />}
    </div>
  );
};

export default MyDropdownMenuItem;
