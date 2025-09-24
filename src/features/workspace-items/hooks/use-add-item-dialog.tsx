import type { CollectionType } from "@prisma/client";
import { create } from "zustand";

type AddItemDialogState = {
  open: boolean;
  showFolder: boolean;
  parentFolderId: string | null;
  onOpen: (parentFolder?: string | null) => void;
  onClose: () => void;
  onOpenAddCollection: (parentFolderId?: string | null) => void;
};

export const useAddItemDialog = create<AddItemDialogState>((set) => ({
  open: false,
  showFolder: false,
  parentFolderId: null,
  collectionType: null,
  onOpen: (parentFolderId) =>
    set({
      open: true,
      showFolder: true,
      parentFolderId: parentFolderId ?? null,
    }),
  onClose: () =>
    set({
      open: false,
      showFolder: false,
      parentFolderId: null,
    }),
  onOpenAddCollection: (parentFolderId) =>
    set({
      open: true,
      showFolder: false,
      parentFolderId: parentFolderId ?? null,
    }),
}));
