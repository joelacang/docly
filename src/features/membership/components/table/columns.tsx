import Badge from "@/components/custom/badge";
import Centered from "@/components/layout/centered";
import { Button } from "@/components/ui/button";
import UserBadge from "@/features/users/user-badge";
import type { MemberPreview } from "@/types/member";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";
import MemberDropdownMenu from "../member-dropdown-menu";
import { memberRoleIcon, memberStatusIcon } from "@/utils/icon";

export const memberColumns: ColumnDef<MemberPreview>[] = [
  {
    accessorKey: "member.name",
    header: ({ column }) => (
      <Centered>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </Centered>
    ),
    cell: ({ row }) => {
      return (
        <div className="px-4">
          <UserBadge user={row.original.member} micro />
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => <Centered>Role</Centered>,
    cell: ({ row }) => {
      const role = row.original.role;

      return (
        <Centered>
          <Badge display={memberRoleIcon[role]}>{role}</Badge>
        </Centered>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <Centered>Status</Centered>,
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Centered>
          <Badge display={memberStatusIcon[status]}>{status}</Badge>
        </Centered>
      );
    },
  },
  {
    accessorKey: "joinDate",
    header: () => <Centered>Join Date</Centered>,
    cell: ({ row }) => (
      <Centered>{row.original.joinDate?.toLocaleDateString()}</Centered>
    ),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <Centered className="">
        <MemberDropdownMenu member={row.original} />
      </Centered>
    ),
  },
];
