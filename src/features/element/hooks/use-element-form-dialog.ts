import {
  type ElementType,
  type CollectionType,
  type EntryType,
} from "@prisma/client";
import { create } from "zustand";

type ElementFormDialogState = {
  open: boolean;
  isPending: boolean;
  elementType: ElementType | null;
  parentFolderId: string | null;
  collectionType: CollectionType | null;
  collectionId: string | null;
  entryType: EntryType | null;
  onOpenWorkspace: () => void;
  onOpenFolder: (parentFolderId: string | null) => void;
  onOpenCollection: (
    parentFolderId: string | null,
    collectionType: CollectionType,
  ) => void;
  onOpenEntry: (collectionId: string, entryType: EntryType) => void;
  onClose: () => void;
  onClear: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useElementFormDialog = create<ElementFormDialogState>((set) => ({
  open: false,
  isPending: false,
  elementType: null,
  parentFolderId: null,
  collectionType: null,
  collectionId: null,
  entryType: null,
  onOpenWorkspace: () => set({ elementType: "Workspace", open: true }),
  onOpenFolder: (parentFolderId) =>
    set({ elementType: "Folder", open: true, parentFolderId }),
  onOpenCollection: (parentFolderId, collectionType) =>
    set({
      elementType: "Collection",
      parentFolderId,
      open: true,
      collectionType,
    }),
  onOpenEntry: (collectionId, entryType) =>
    set({ elementType: "Entry", collectionId, entryType, open: true }),
  onClose: () =>
    set({
      open: false,
      isPending: false,
      elementType: null,
      parentFolderId: null,
      collectionType: null,
      collectionId: null,
      entryType: null,
    }),
  onClear: () =>
    set({
      isPending: false,
      elementType: null,
      parentFolderId: null,
      collectionType: null,
      collectionId: null,
      entryType: null,
    }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
