import { create } from "zustand";

type SidebarSheetState = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

export const useSidebarSheet = create<SidebarSheetState>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onToggle: () => set((state) => ({ open: !state.open })),
}));
