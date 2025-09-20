import { create } from "zustand";

type JoinWorkspaceDialogState = {
  open: boolean;
  isPending: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useJoinWorkspaceDialog = create<JoinWorkspaceDialogState>(
  (set) => ({
    open: false,
    isPending: false,
    onOpen: () => set({ open: true }),
    onClose: () => set({ open: false }),
    onPending: () => set({ isPending: true }),
    onCompleted: () => set({ isPending: false }),
  }),
);
