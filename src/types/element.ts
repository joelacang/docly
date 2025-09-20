import {
  Color,
  ElementAccess,
  type ElementStatus,
  ElementType,
  type Element,
  type CollectionType,
  type EntryType,
} from "@prisma/client";
import z from "zod";
import type { User } from "./user";
import type { LucideIcon } from "lucide-react";

export const createElementSchema = z
  .object({
    name: z.string().min(4).max(124),
    description: z.string().optional(),
    access: z.nativeEnum(ElementAccess),
    type: z.nativeEnum(ElementType),
    color: z.nativeEnum(Color),
    otherOwnerIds: z.array(z.string()),
    workspaceId: z.string().cuid().optional(),
    parentFolderId: z.string().cuid().optional(),
    avatarUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type !== ElementType.Workspace) {
        return !!data.workspaceId;
      }
      return true;
    },
    {
      message: "workspaceId is required",
      path: ["workspaceId"],
    },
  );

export type CreateElement = z.infer<typeof createElementSchema>;

export type ElementDetail = Element & {
  createdBy: User | null;
  owners: User[];
};

export type ElementPreview = {
  id: string;
  name: string;
  slug: string;
  status: ElementStatus;
  access: ElementAccess;
  type: ElementType;
  color: Color;
  avatarUrl?: string | null;
};

export type Display = {
  name: string;
  label: string;
  description?: string;
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
};

export type EntryDisplay = Display & {
  type: EntryType;
  collection?: CollectionType;
};

export type UIDisplay = ElementDisplay | CollectionDisplay | EntryDisplay;
