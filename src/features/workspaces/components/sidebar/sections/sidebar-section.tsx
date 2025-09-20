import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SidebarMenuButton from "@/features/sidebar/components/sibebar-menu-button";

import type { MenuItem } from "@/types";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface Props {
  name: string;
  icon?: LucideIcon;
  items: MenuItem[];
  empty?: React.ReactNode;
}

const SidebarSection = ({ name, icon: Icon, items, empty }: Props) => {
  const [open, setOpen] = useState(true);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button className="" variant="ghost">
          <div className="text-muted-foreground flex flex-row items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <p className="text-sm font-semibold">{name}</p>
          </div>
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {items.length ? (
          <div>
            {items.map((item) => (
              <SidebarMenuButton key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-2">{empty}</div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarSection;
