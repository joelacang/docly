import type { Color } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import { create } from "zustand";

type NavigationItem = {
  order?: number;
  icon: LucideIcon | React.ReactNode;
  color: Color;
  label: string;
  slug: string;
  url: string;
};

type NavigationBarState = {
  items: NavigationItem[];
  addItem: (item: NavigationItem) => void;
  removeItem: (order: number) => void;
  onClear: () => void;
};

export const useNavigationBar = create<NavigationBarState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          order: item.order ?? state.items.length + 1,
          ...item,
        },
      ],
    })),
  removeItem: (order) =>
    set((state) => ({
      items: state.items.filter((i) => i.order !== order),
    })),
  onClear: () => set({ items: [] }),
}));
