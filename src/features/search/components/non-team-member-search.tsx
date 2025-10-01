import UserBadge from "@/features/users/user-badge";
import { api } from "@/trpc/react";
import type { SearchOption } from "@/types";
import type { User } from "@/types/user";
import Search from "./search";

interface Props {
  workspaceId: string;
  teamId: string;
  disabled?: boolean;
  placeholder?: string;
  value: SearchOption<User> | null;
  onChange: (option: SearchOption<User> | null) => void;
}

const NonTeamMemberSearch = ({
  workspaceId,
  teamId,
  disabled,
  placeholder,
  value,
  onChange,
}: Props) => {
  const useSearchQuery = (searchValue: string) => {
    return api.teamMembership.searchNonMember.useQuery(
      {
        workspaceId,
        teamId,
        searchValue,
      },
      { enabled: searchValue.length > 2 },
    );
  };

  const mapToOption = (user: User): SearchOption<User> => {
    return {
      value: user.id,
      label: user.name,
      data: user,
    };
  };

  const searchProps = {
    disabled,
    placeholder: placeholder ?? "Enter User Name To Search...",
    useSearchQuery,
    mapToOption,
    renderOption: (user: SearchOption<User>) => <UserBadge user={user.data} />,
    renderSingleValue: (user: SearchOption<User>) => (
      <UserBadge user={user.data} micro styled />
    ),
  };

  return (
    <Search {...searchProps} mode="single" value={value} onChange={onChange} />
  );
};

export default NonTeamMemberSearch;
