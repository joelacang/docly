import {
  FolderIcon,
  MessageCircleIcon,
  NotebookIcon,
  StarIcon,
  StarOffIcon,
} from "lucide-react";

import { Mode, type MenuItem } from "@/types";
import { Color } from "@prisma/client";
import SidebarSection from "./sidebar-section";
import AlertMessage from "@/components/messages/alert-message";

const items: MenuItem[] = [
  {
    id: "folder-1",
    label: "My Important Notes",
    icon: FolderIcon,
    color: Color.ORANGE,
    showDropdownButton: true,
  },
  {
    id: "folder-2",
    label: "Research Data Q3",
    icon: NotebookIcon,
    color: Color.TEAL,
    showDropdownButton: true,
  },
  {
    id: "folder-3",
    label: "Employee Chat",
    icon: MessageCircleIcon,
    color: Color.CYAN,
    showDropdownButton: true,
  },
  {
    id: "folder-4",
    label: "Admin Files (Restricted)",
    icon: FolderIcon,
    color: Color.INDIGO,
    showDropdownButton: true,
  },
];
const FavoritesSection = () => {
  return (
    <SidebarSection
      name="FAVORITES"
      icon={StarIcon}
      items={[]}
      empty={
        <AlertMessage
          title="No Favorites Found."
          icon={StarOffIcon}
          mode={Mode.DEFAULT}
          dashed
        />
      }
    />
  );
};

export default FavoritesSection;
