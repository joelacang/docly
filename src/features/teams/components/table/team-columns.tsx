import Centered from "@/components/layout/centered";
import type { TeamMembers } from "@/types/team";
import type { ColumnDef } from "@tanstack/react-table";
import TeamBadge from "../team-badge";
import Badge from "@/components/custom/badge";
import { teamPrivacyIcon, teamTypeIcon } from "@/utils/icon";
import TeamDropdownMenu from "../team-dropdown-menu";
import TeamLeadersCardSection from "../team-leader-card-section";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";

export const teamColumns: ColumnDef<TeamMembers>[] = [
  {
    accessorKey: "element.name",
    header: () => <Centered>Team</Centered>,
    cell: ({ row }) => {
      const leaders = row.original.members.filter(
        (m) => m.membership.role === "Leader",
      );
      return (
        <div className="py-2 pl-4">
          <TeamBadge team={row.original.team}>
            {leaders.length ? (
              <TeamLeadersCardSection leaders={leaders.map((l) => l.member)} />
            ) : null}
          </TeamBadge>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => <Centered>Type</Centered>,
    cell: ({ row }) => {
      return (
        <Centered>
          <Badge display={teamTypeIcon[row.original.team.type]}>
            {row.original.team.type}
          </Badge>
        </Centered>
      );
    },
  },
  {
    accessorKey: "privacy",
    header: () => <Centered>Privacy</Centered>,
    cell: ({ row }) => {
      return (
        <Centered>
          <Badge display={teamPrivacyIcon[row.original.team.privacy]}>
            {row.original.team.privacy}
          </Badge>
        </Centered>
      );
    },
  },
  {
    accessorKey: "id",
    header: () => null,
    cell: ({ row }) => {
      return (
        <TeamDropdownMenu team={row.original.team}>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </TeamDropdownMenu>
      );
    },
  },
];
