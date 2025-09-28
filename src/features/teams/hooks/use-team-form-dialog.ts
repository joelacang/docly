import { create } from "zustand";

type TeamDialogState = {
  open: boolean;
  isPending: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useTeamFormDialog = create<TeamDialogState>((set) => ({
  open: false,
  isPending: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false, isPending: false }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
