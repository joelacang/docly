import SidebarMenuButton from "@/features/sidebar/components/sidebar-menu-button";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import type { CollectionPreview } from "@/types/collection";
import { COLLECTION_DISPLAYS } from "@/utils/elements";
import { useState } from "react";
import SidebarCollectionDropdownMenu from "@/features/sidebar/components/sidebar-collection-dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useMyWorkspaces } from "@/providers/workspace-provider";

interface Props {
  item: CollectionPreview;
}

const CollectionSidebarMenuItem = ({ item }: Props) => {
  const collectionDisplay = COLLECTION_DISPLAYS[item.type];
  const router = useRouter();
  const { baseUrl } = useMyWorkspaces();
  const pathname = usePathname();

  const menuItem: MenuItem = {
    id: item.id,
    label: `${item.element.name}`,
    icon: collectionDisplay.icon,
    color: item.element.color,
    highlighted:
      pathname === `${baseUrl}/collections/${item.type}/${item.element.slug}`,
    action: () => {
      router.push(`${baseUrl}/collections/${item.type}/${item.element.slug}`);
    },
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
        highlighted={isHighlighted || menuItem.highlighted}
      />
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
