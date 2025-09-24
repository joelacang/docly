import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAddItemDialog } from "../hooks/use-add-item-dialog";
import { cn } from "@/lib/utils";

interface Props {
  isCompact?: boolean;
}
const AddItemButton = ({ isCompact = false }: Props) => {
  const { onOpen } = useAddItemDialog();
  return (
    <Button
      variant={isCompact ? "ghost" : "blue"}
      className={cn(isCompact && "rounded-full")}
      onClick={() => onOpen(null)}
      size={isCompact ? "icon" : "default"}
    >
      <PlusIcon />
      {!isCompact && "Add Item"}
    </Button>
  );
};

export default AddItemButton;
