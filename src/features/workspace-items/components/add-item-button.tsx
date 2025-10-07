import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAddItemDialog } from "../hooks/use-add-item-dialog";
import { cn } from "@/lib/utils";
import { useMyTeams } from "@/providers/team-provider";

interface Props {
  isCompact?: boolean;
}
const AddItemButton = ({ isCompact = false }: Props) => {
  const { onOpen } = useAddItemDialog();
  const { currentTeam } = useMyTeams();
  return (
    <Button
      variant={isCompact ? "ghost" : "blue"}
      className={cn(isCompact && "rounded-full")}
      onClick={() => onOpen({ teamId: currentTeam?.team.id ?? null })}
      size={isCompact ? "icon" : "default"}
    >
      <PlusIcon />
      {!isCompact && "Add Item"}
    </Button>
  );
};

export default AddItemButton;
