import { Mode } from "@/types";
import type {
  Color,
  ElementStatus,
  MembershipRole,
  MembershipStatus,
  TeamPrivacy,
  TeamType,
} from "@prisma/client";
import {
  Ban,
  Building,
  CheckCircle,
  CheckCircle2,
  CheckCircle2Icon,
  CheckCircleIcon,
  Clock,
  Crown,
  EyeOff,
  FileEdit,
  GanttChart,
  HelpCircleIcon,
  InfoIcon,
  Lock,
  PauseCircle,
  PencilLine,
  ShieldAlert,
  ShieldAlertIcon,
  ShieldCheck,
  Star,
  Trash2,
  TriangleAlertIcon,
  User,
  UserPlus,
  Users,
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

export type IconDisplay = {
  icon: LucideIcon;
  color: Color;
};

export const teamTypeIcon: Record<TeamType, IconDisplay> = {
  Department: {
    icon: Building,
    color: "BLUE", // blue-600
  },
  Project: {
    icon: GanttChart, // or ClipboardList
    color: "GREEN", // emerald-500
  },
  CrossFunctional: {
    icon: Users, // or Share2
    color: "ORANGE", // amber-500
  },
  SpecialInterest: {
    icon: Star, // or Heart
    color: "PINK", // pink-500
  },
};

export const teamPrivacyIcon: Record<TeamPrivacy, IconDisplay> = {
  Closed: {
    icon: Lock,
    color: "GRAY",
  },
  Open: {
    icon: Users,
    color: "GREEN",
  },
  Secret: {
    icon: EyeOff,
    color: "PURPLE",
  },
};

export const memberRoleIcon: Record<MembershipRole, IconDisplay> = {
  Owner: {
    icon: Crown,
    color: "PURPLE",
  },
  Admin: {
    icon: ShieldCheck,
    color: "BLUE",
  },
  Editor: {
    icon: PencilLine,
    color: "GREEN",
  },
  Member: {
    icon: User,
    color: "GRAY",
  },
  Guest: {
    icon: UserPlus,
    color: "ORANGE",
  },
};

export const memberStatusIcon: Record<MembershipStatus, IconDisplay> = {
  Pending: {
    icon: Clock,
    color: "YELLOW",
  },
  Active: {
    icon: CheckCircle2,
    color: "GREEN",
  },
  Inactive: {
    icon: PauseCircle,
    color: "GRAY",
  },
  Blocked: {
    icon: Ban,
    color: "RED",
  },
};

export const elementStatusIcon: Record<ElementStatus, IconDisplay> = {
  Pending: {
    icon: Clock,
    color: "YELLOW",
  },
  Active: {
    icon: CheckCircle,
    color: "GREEN",
  },
  Restricted: {
    icon: ShieldAlert,
    color: "ORANGE",
  },
  Deleted: {
    icon: Trash2,
    color: "RED",
  },
  Draft: {
    icon: FileEdit,
    color: "GRAY",
  },
};
