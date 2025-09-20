import { Divide, ListIcon, PlusIcon, SearchXIcon } from "lucide-react";
import SidebarSection from "./sidebar-section";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/components/messages/alert-message";
import { useAddItemDialog } from "@/features/workspace-items/hooks/use-add-item-dialog";

const ItemsSection = () => {
  const { onOpen } = useAddItemDialog();
  return (
    <SidebarSection
      name="ITEMS"
      icon={ListIcon}
      items={[]}
      empty={
        <AlertMessage
          title="No Items Found For this Workspace"
          description=""
          icon={SearchXIcon}
          className="bg-muted rounded-lg border"
        >
          <Button variant="blue" onClick={onOpen}>
            <PlusIcon />
            Add Item
          </Button>
        </AlertMessage>
      }
    />
  );
};

export default ItemsSection;
