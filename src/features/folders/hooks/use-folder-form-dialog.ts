import { create } from "zustand";

type FolderFormDialogState = {
  open: boolean;
  isPending: boolean;
  parentFolderId: string | null;
  teamId: string | null;
  depth: number;
  onOpen: ({
    parentFolderId,
    teamId,
    depth,
  }: {
    parentFolderId?: string | null;
    teamId?: string | null;
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
  teamId: null,
  depth: 0,
  onOpen: ({ parentFolderId, teamId, depth }) =>
    set({
      open: true,
      parentFolderId: parentFolderId ?? null,
      teamId: teamId ?? null,
      depth: depth ?? 0,
    }),
  onClose: () =>
    set({
      parentFolderId: null,
      isPending: false,
      open: false,
      depth: 0,
      teamId: null,
    }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
