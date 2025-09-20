import { create } from "zustand";

type LeftSidebarState = {
  open: boolean;
  onToggle: () => void;
};

export const useWorkspaceSidebar = create<LeftSidebarState>((set) => ({
  open: true,
  onToggle: () => set((state) => ({ open: !state.open })),
}));
