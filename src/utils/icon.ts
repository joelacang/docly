import { Mode } from "@/types";
import {
  CheckCircle2Icon,
  HelpCircleIcon,
  InfoIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react";

export function getModeIcon(mode: Mode): LucideIcon {
  switch (mode) {
    case Mode.INFO:
      return InfoIcon;
    case Mode.SUCCESS:
      return CheckCircle2Icon;
    case Mode.DEFAULT:
      return InfoIcon;
    case Mode.ERROR:
      return TriangleAlertIcon;
    case Mode.HELP:
      return HelpCircleIcon;
    default:
      return InfoIcon;
  }
}
