import Centered from "@/components/layout/centered";
import type { TeamPreview } from "@/types/team";
import type { ColumnDef } from "@tanstack/react-table";
import TeamBadge from "../team-badge";
import Badge from "@/components/custom/badge";
import { teamPrivacyIcon, teamTypeIcon } from "@/utils/icon";
import TeamDropdownMenu from "../team-dropdown-menu";
import TeamLeaderCardSection from "../team-leader-card-section";

export const teamColumns: ColumnDef<TeamPreview>[] = [
  {
    accessorKey: "element.name",
    header: () => <Centered>Team</Centered>,
    cell: ({ row }) => {
      return (
        <div className="py-2 pl-4">
          <TeamBadge team={row.original}>
            {row.original.leaders.length ? (
              <TeamLeaderCardSection leaders={row.original.leaders} />
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
          <Badge display={teamTypeIcon[row.original.type]}>
            {row.original.type}
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
          <Badge display={teamPrivacyIcon[row.original.privacy]}>
            {row.original.privacy}
          </Badge>
        </Centered>
      );
    },
  },
  {
    accessorKey: "id",
    header: () => null,
    cell: ({ row }) => {
      return <TeamDropdownMenu team={row.original} />;
    },
  },
];
