import {
  FolderIcon,
  MessageCircleIcon,
  NotebookIcon,
  StarIcon,
} from "lucide-react";

import type { MenuItem } from "@/types";
import { Color } from "@prisma/client";
import SidebarSection from "./sidebar-section";

const items: MenuItem[] = [
  {
    id: "folder-1",
    label: "My Important Notes",
    icon: FolderIcon,
    color: Color.ORANGE,
  },
  {
    id: "folder-2",
    label: "Research Data Q3",
    icon: NotebookIcon,
    color: Color.TEAL,
  },
  {
    id: "folder-3",
    label: "Employee Chat",
    icon: MessageCircleIcon,
    color: Color.CYAN,
  },
  {
    id: "folder-4",
    label: "Admin Files (Restricted)",
    icon: FolderIcon,
    color: Color.INDIGO,
  },
];
const FavoritesSection = () => {
  return <SidebarSection name="FAVORITES" icon={StarIcon} items={items} />;
};

export default FavoritesSection;
