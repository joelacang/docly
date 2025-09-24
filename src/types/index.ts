import type { Color } from "@prisma/client";
import type { LucideIcon } from "lucide-react";

export type QueryStateHandlerProps<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T | undefined | null;
  loadingLabel?: string | React.ReactNode | null;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorMessage?: string | null;
  emptyContent?: React.ReactNode;
  children: (data: T) => React.ReactNode;
};

export type MenuItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
  color?: Color;
  hidden?: boolean;
  disabled?: boolean;
  action?: () => void;
  hasSeparator?: boolean;
  subMenus?: MenuItem[];
  showDropdownButton?: boolean;
  mode?: "default" | "destructive";
};

export enum SIZE {
  MICRO,
  SMALL,
  MEDIUM,
  LARGE,
  XLARGE,
}

export enum Mode {
  INFO,
  SUCCESS,
  ERROR,
  DEFAULT,
  HELP,
}
