import { ListIcon, PlusIcon, SearchXIcon } from "lucide-react";
import SidebarSection from "./sidebar-section";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { Access } from "@/types/workspace";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AlertMessage from "@/components/messages/alert-message";
import AddItemButton from "@/features/workspace-items/components/add-item-button";
import WorkspaceItemsList from "@/features/workspace-items/components/workspace-items-list";

const ItemsSection = () => {
  const { currentWorkspace } = useMyWorkspaces();
  const isEditor = Boolean(
    currentWorkspace?.access && currentWorkspace?.access >= Access.EDIT,
  );
  const [isEmpty, setIsEmpty] = useState(true);

  return (
    <SidebarSection
      name="ITEMS"
      icon={ListIcon}
      showSettings={!isEmpty}
      settings={<AddItemButton isCompact />}
    >
      <div className={cn(isEmpty && "my-2 rounded-xl border-2 border-dashed")}>
        {currentWorkspace && (
          <WorkspaceItemsList
            parentFolderId={null}
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
