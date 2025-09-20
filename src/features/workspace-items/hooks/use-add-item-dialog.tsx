import { create } from "zustand";

type AddItemDialogState = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAddItemDialog = create<AddItemDialogState>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
