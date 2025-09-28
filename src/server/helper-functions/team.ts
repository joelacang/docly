import type { TeamPreview } from "@/types/team";
import type { TeamPreviewSelected } from "./prisma";

export function convertToTeamPreview(data: TeamPreviewSelected) {
  const { _count, members, ...teamFields } = data;

  return {
    ...teamFields,
    membersCount: _count.members,
    leaders: members.map((m) => m.member),
  } as TeamPreview;
}
