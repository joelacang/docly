import { Button } from "@/components/ui/button";
import SidebarMenuButton from "@/features/sidebar/components/sidebar-menu-button";
import SidebarFolderDropdownMenu from "@/features/sidebar/components/sidebar-folder-dropdown-menu";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import type { FolderPreview } from "@/types/folder";
import { ELEMENT_DISPLAYS } from "@/utils/elements";
import { useState } from "react";
import { FolderIcon, FolderOpenIcon } from "lucide-react";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { usePathname } from "next/navigation";

interface Props {
  item: FolderPreview;
  open?: boolean;
  unlocked?: boolean;
}

const FolderSidebarMenuItem = ({ item, open, unlocked = false }: Props) => {
  const { baseUrl } = useMyWorkspaces();
  const pathname = usePathname();

  const menuItem: MenuItem = {
    id: item.id,
    label: `${item.element.name}`,
    icon: open ? FolderOpenIcon : FolderIcon,
    color: item.element.color,
    highlighted: pathname === `${baseUrl}/folders/${item.element.slug}`,
  };
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHighlighted(true);
  };
  const handleMouseLeave = () => {
    if (!dropdownOpen) setIsHighlighted(false);
  };
  return (
    <div
      className="flex flex-row items-center justify-between gap-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarMenuButton
        item={menuItem}
        highlighted={isHighlighted}
        open={open}
        unlocked={unlocked}
      />

      <div className={cn(isHighlighted ? "opacity-100" : "opacity-0")}>
        <SidebarFolderDropdownMenu
          open={dropdownOpen}
          onOpenChange={(open) => {
            setDropdownOpen(open);
            setIsHighlighted(open); // highlight while open
          }}
          folder={item}
        />
      </div>
    </div>
  );
};

export default FolderSidebarMenuItem;
