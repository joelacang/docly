import UserBadge from "@/features/users/user-badge";
import type { MemberPreview } from "@/types/member";
import MemberDropdownMenu from "./member-dropdown-menu";
import Badge from "@/components/custom/badge";
import { CalendarIcon } from "lucide-react";
import { memberRoleIcon, memberStatusIcon } from "@/utils/icon";

interface Props {
  member: MemberPreview;
}

const Badges = ({ member }: Props) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            member.status === "Active"
              ? "bg-green-400"
              : member.status === "Pending"
                ? "bg-yellow-400"
                : "bg-gray-400"
          }`}
        />
        <Badge display={memberStatusIcon[member.status]}>{member.status}</Badge>
      </div>
      <Badge display={memberRoleIcon[member.role]}>{member.role}</Badge>
    </div>
  );
};
const MemberCard = ({ member }: Props) => {
  return (
    <div className="group bg-card relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300">
      {/* Subtle gradient background on hover */}

      <div className="relative flex items-center justify-between gap-6">
        {/* Left side - User info */}
        <div className="min-w-0 flex-1">
          <UserBadge user={member.member}>
            <div className="flex items-center justify-start gap-6 pt-2">
              {member.joinDate && (
                <div className="text-muted-foreground flex flex-row items-center justify-start gap-2">
                  <CalendarIcon className="size-4" />
                  <p className="text-xs">
                    {member.joinDate?.toLocaleDateString()}
                  </p>
                </div>
              )}
              <div className="flex md:hidden">
                <Badges member={member} />
              </div>
            </div>
          </UserBadge>
        </div>

        {/* Right side - Status, Role, and Actions */}
        <div className="flex flex-shrink-0 flex-row items-center gap-2">
          <div className="hidden md:flex">
            <Badges member={member} />
          </div>
          <div className="transform opacity-50 transition-all duration-200 group-hover:scale-105 group-hover:opacity-100">
            <MemberDropdownMenu member={member} />
          </div>
        </div>
      </div>

      {/* Mobile-only status row */}
    </div>
  );
};
export default MemberCard;
