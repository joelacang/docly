import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { MenuItem } from "@/types";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface Props {
  name: string;
  icon: LucideIcon;
  items: MenuItem[];
}

const SidebarSection = ({ name, icon: Icon, items }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarGroup>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex size-fit cursor-pointer flex-row items-center justify-start gap-2 px-2 py-0">
            <Icon />
            <SidebarGroupLabel>
              <span>{name}</span>
            </SidebarGroupLabel>
            {open ? (
              <ChevronDownIcon size={16} />
            ) : (
              <ChevronRightIcon size={16} />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id} className="cursor-pointer">
                  <SidebarMenuButton asChild>
                    <div>
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
};

export default SidebarSection;
