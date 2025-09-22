import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  tooltip: string;
  className?: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}
const Hint = ({ tooltip, className, children, side = "top" }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={cn(className, "px-4 py-2.5 text-sm shadow-lg")}
          side={side}
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;
