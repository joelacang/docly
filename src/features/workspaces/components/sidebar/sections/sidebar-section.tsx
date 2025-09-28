import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Color } from "@prisma/client";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface Props {
  name: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  settings?: React.ReactNode;
  showSettings?: boolean;
  color?: Color;
}

const SidebarSection = ({
  name,
  icon: Icon,
  children,
  settings,
  showSettings,
  color = "BLUE",
}: Props) => {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex flex-row items-center justify-between gap-4">
        <CollapsibleTrigger asChild>
          <Button className="" variant="ghost">
            <div className="flex flex-row items-center gap-2">
              {Icon && (
                <div>
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <p className="text-sm font-semibold">{name}</p>
            </div>
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </Button>
        </CollapsibleTrigger>
        {showSettings && <>{settings}</>}
      </div>

      <CollapsibleContent className="px-2 py-2 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarSection;
