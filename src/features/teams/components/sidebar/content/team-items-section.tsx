import { ListIcon } from "lucide-react";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Access } from "@/types/workspace";

import { useState } from "react";
import { cn } from "@/lib/utils";
import AddItemButton from "@/features/workspace-items/components/add-item-button";
import WorkspaceItemsList from "@/features/workspace-items/components/workspace-items-list";
import SidebarSection from "./sidebar-section";
import { useMyTeams } from "@/providers/team-provider";

const ItemsSection = () => {
  const { currentWorkspace } = useMyWorkspaces();
  const { currentTeam } = useMyTeams();
  const isEditor = Boolean(
    currentWorkspace?.access && currentWorkspace?.access >= Access.EDIT,
  );
  const [isEmpty, setIsEmpty] = useState(true);

  return (
    <SidebarSection
      name="TEAM ITEMS"
      icon={ListIcon}
      showSettings={!isEmpty}
      settings={<AddItemButton isCompact />}
      color={currentWorkspace?.workspace.element.color}
    >
      <div className={cn(isEmpty && "my-2 rounded-xl border-2 border-dashed")}>
        {currentWorkspace && (
          <WorkspaceItemsList
            parentFolderId={null}
            teamId={currentTeam?.team.id ?? null}
            workspaceId={currentWorkspace?.workspace.id}
            isEditor={isEditor}
            onEmpty={setIsEmpty}
          />
        )}
      </div>
    </SidebarSection>
  );
};

export default ItemsSection;
