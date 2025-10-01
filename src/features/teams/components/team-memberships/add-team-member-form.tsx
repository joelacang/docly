import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldLabel from "@/features/form/components/field-label";
import MemberSearch from "@/features/membership/components/member-search";
import NonTeamMemberSearch from "@/features/search/components/non-team-member-search";
import type { SearchOption } from "@/types";
import type { MemberOption } from "@/types/member";
import type { User } from "@/types/user";
import { TeamRole } from "@prisma/client";
import { XIcon } from "lucide-react";

interface Props {
  workspaceId: string;
  teamId: string;
  tempId: string;
  value: SearchOption<User> | null;
  role: TeamRole;
  onChange: (member: SearchOption<User> | null) => void;
  onRoleChange: (role: TeamRole) => void;
  onRemoveUser: (tempId: string) => void;
}
const AddTeamMemberForm = ({
  workspaceId,
  teamId,
  value,
  role,
  tempId,
  onChange,
  onRoleChange,
  onRemoveUser,
}: Props) => {
  return (
    <div className="relative rounded-xl border p-4">
      <div className="space-y-4 pt-2">
        <div className="space-y-3">
          <FieldLabel isRequired>Name:</FieldLabel>
          <NonTeamMemberSearch
            workspaceId={workspaceId}
            teamId={teamId}
            disabled={false}
            value={value}
            onChange={onChange}
          />
        </div>

        <div className="space-y-3">
          <FieldLabel isRequired>Role:</FieldLabel>
          <Select
            value={role}
            onValueChange={(role) => onRoleChange(role as TeamRole)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role..." />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TeamRole).map((role) => {
                if (role === "Leader") return;

                return (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="absolute top-1 right-1">
        <Button
          className="rounded-full"
          variant="ghost"
          size="icon"
          onClick={() => onRemoveUser(tempId)}
        >
          <XIcon className="text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default AddTeamMemberForm;
