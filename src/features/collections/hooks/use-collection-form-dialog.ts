import type { CollectionType } from "@prisma/client";
import { create } from "zustand";

type CollectionFormDialogState = {
  open: boolean;
  collectionType: CollectionType | null;
  parentFolderId: string | null;
  teamId: string | null;
  isPending: boolean;
  onOpen: ({
    parentFolderId,
    collectionType,
    teamId,
  }: {
    parentFolderId?: string | null;
    collectionType: CollectionType;
    teamId?: string | null;
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
    teamId: null,
    onOpen: ({ parentFolderId, collectionType, teamId }) =>
      set({
        parentFolderId: parentFolderId ?? null,
        collectionType,
        teamId: teamId ?? null,
        open: true,
      }),
    onClose: () =>
      set({
        parentFolderId: null,
        collectionType: null,
        teamId: null,
        isPending: false,
        open: false,
      }),
    onPending: () => set({ isPending: true }),
    onCompleted: () => set({ isPending: false }),
  }),
);
