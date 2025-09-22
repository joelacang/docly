import { create } from "zustand";

type CreateWorkspaceDialogState = {
  open: boolean;
  isPending: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useCreateWorkspaceDialog = create<CreateWorkspaceDialogState>(
  (set) => ({
    open: false,
    isPending: false,
    onOpen: () => set({ open: true }),
    onClose: () => set({ open: false, isPending: false }),
    onPending: () => set({ isPending: true }),
    onCompleted: () => set({ isPending: false }),
  }),
);
