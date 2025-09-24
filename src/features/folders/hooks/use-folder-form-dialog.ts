import { create } from "zustand";

type FolderFormDialogState = {
  open: boolean;
  isPending: boolean;
  parentFolderId: string | null;
  depth: number;
  onOpen: ({
    parentFolderId,
    depth,
  }: {
    parentFolderId?: string | null;
    depth?: number;
  }) => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useFolderFormDialog = create<FolderFormDialogState>((set) => ({
  open: false,
  isPending: false,
  parentFolderId: null,
  depth: 0,
  onOpen: ({ parentFolderId, depth }) =>
    set({
      open: true,
      parentFolderId: parentFolderId ?? null,
      depth: depth ?? 0,
    }),
  onClose: () =>
    set({ parentFolderId: null, isPending: false, open: false, depth: 0 }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
