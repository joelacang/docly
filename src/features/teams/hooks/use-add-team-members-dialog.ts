import type { TeamSummary } from "@/types/team";
import { create } from "zustand";

type AddTeamMemberDialogState = {
  open: boolean;
  team: TeamSummary | null;
  isPending: boolean;
  onOpen: (team: TeamSummary) => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useAddTeamMembersDialog = create<AddTeamMemberDialogState>(
  (set) => ({
    open: false,
    team: null,
    isPending: false,
    onOpen: (team) => set({ open: true, team }),
    onClose: () => set({ open: false, team: null }),
    onPending: () => set({ isPending: true }),
    onCompleted: () => set({ isPending: false }),
  }),
);
