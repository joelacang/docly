import {
  type CollectionType,
  Color,
  type EntryType,
  type ElementStatus,
  ElementType,
  type Element,
} from "@prisma/client";
import z from "zod";
import type { User } from "./user";
import type { LucideIcon } from "lucide-react";

export const createElementBaseSchema = z.object({
  name: z.string().min(4).max(124),
  description: z.string().optional(),
  elementType: z.enum(ElementType),
  color: z.enum(Color),
  avatarUrl: z.string().optional(),
});

export type CreateBaseElement = z.infer<typeof createElementBaseSchema>;

export type ElementDetail = Element & {
  createdBy: User | null;
  owners: User[];
};

export type ElementPreview = {
  id: string;
  name: string;
  slug: string;
  status: ElementStatus;
  type: ElementType;
  color: Color;
  avatarUrl?: string | null;
};

export type Display = {
  name: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: Color;
};

export type CollectionCategory = {
  name: string;
  description?: string;
  icon: LucideIcon;
  color: Color;
};

export type ElementDisplay = Display & {
  type: ElementType;
};

export type CollectionDisplay = Display & {
  type: CollectionType;
  category?: CollectionCategory;
  entry: EntryType;
};

export type EntryDisplay = Display & {
  type: EntryType;
  collection?: CollectionType;
};

export type UIDisplay = ElementDisplay | CollectionDisplay | EntryDisplay;
