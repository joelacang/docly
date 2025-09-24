import SidebarMenuButton from "@/features/sidebar/components/sidebar-menu-button";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import type { CollectionPreview } from "@/types/collection";
import { COLLECTION_DISPLAYS } from "@/utils/elements";
import { useState } from "react";
import SidebarCollectionDropdownMenu from "@/features/sidebar/components/sidebar-collection-dropdown-menu";

interface Props {
  item: CollectionPreview;
  isEditor?: boolean;
}

const CollectionSidebarMenuItem = ({ item, isEditor }: Props) => {
  const collectionDisplay = COLLECTION_DISPLAYS[item.type];
  const menuItem: MenuItem = {
    id: item.id,
    label: `${item.element.name}`,
    icon: collectionDisplay.icon,
    color: item.element.color,
    showDropdownButton: isEditor,
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
      className="flex flex-row items-center justify-between gap-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarMenuButton item={menuItem} isHighlighted={isHighlighted} />
      <div className={cn(isHighlighted ? "opacity-100" : "opacity-0")}>
        <SidebarCollectionDropdownMenu
          open={dropdownOpen}
          onOpenChange={(open) => {
            setDropdownOpen(open);
            setIsHighlighted(open);
          }}
          collection={item}
        />
      </div>
    </div>
  );
};

export default CollectionSidebarMenuItem;
