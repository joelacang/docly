import { useMyWorkspaces } from "@/providers/workspace-provider";
import InputIcon from "@/components/custom/InputIcon";
import FavoritesSection from "./sections/favorites-section";
import ItemsSection from "./sections/items-section";
import { SearchIcon } from "lucide-react";
import DashboardSection from "./sections/dashboard-section";

const WorkspaceSidebarContent = () => {
  const { currentWorkspace } = useMyWorkspaces();
  return (
    <div className="w-full">
      <div className="flex h-full flex-col gap-4 overflow-y-auto">
        <div className="space-y-3 p-2">
          <InputIcon
            icon={SearchIcon}
            placeholder={`Search ${currentWorkspace?.workspace.element.name}`}
            className="bg-input"
          />
        </div>

        <div className="flex h-[calc(100vh-154px)] flex-col overflow-y-auto">
          <div className="space-y-4 p-2">
            <DashboardSection />
            <FavoritesSection />
            <ItemsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSidebarContent;
