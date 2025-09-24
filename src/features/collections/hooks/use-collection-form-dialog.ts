import type { CollectionType } from "@prisma/client";
import { create } from "zustand";

type CollectionFormDialogState = {
  open: boolean;
  collectionType: CollectionType | null;
  parentFolderId: string | null;
  isPending: boolean;
  onOpen: ({
    parentFolderId,
    collectionType,
  }: {
    parentFolderId?: string | null;
    collectionType: CollectionType;
  }) => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useCollectionFormDialog = create<CollectionFormDialogState>(
  (set) => ({
    open: false,
    collectionType: null,
    parentFolderId: null,
    isPending: false,
    onOpen: ({ parentFolderId, collectionType }) =>
      set({ parentFolderId, collectionType, open: true }),
    onClose: () =>
      set({
        parentFolderId: null,
        collectionType: null,
        isPending: false,
        open: false,
      }),
    onPending: () => set({ isPending: true }),
    onCompleted: () => set({ isPending: false }),
  }),
);
