import type { MemberOption } from "@/types/member";
import Search from "./search";
import type { SearchOption } from "@/types";
import type { User } from "@/types/user";
import { api } from "@/trpc/react";
import UserBadge from "@/features/users/user-badge";

interface MemberSearchBaseProps {
  workspaceId: string;
  disabled?: boolean;
  placeholder?: string;
}

interface SingleMemberSearchProps extends MemberSearchBaseProps {
  mode: "single";
  value: SearchOption<User> | null;
  onChange: (option: SearchOption<User> | null) => void;
}

interface MultiMemberSearchProps extends MemberSearchBaseProps {
  mode: "multiple";
  value: SearchOption<User>[];
  onChange: (option: SearchOption<User>[]) => void;
}

type MemberSearchProps = SingleMemberSearchProps | MultiMemberSearchProps;

const MemberSearch = (props: MemberSearchProps) => {
  const { workspaceId, disabled, placeholder } = props;

  const useSearchQuery = (searchValue: string) => {
    return api.membership.searchMember.useQuery(
      { workspaceId, searchValue },
      { enabled: searchValue.length > 2 },
    );
  };

  const mapToOption = (member: User): SearchOption<User> => {
    return {
      value: member.id,
      label: member.name,
      data: member,
    };
  };

  const searchProps = {
    disabled,
    placeholder: placeholder ?? "Enter Member Name To Search...",
    useSearchQuery,
    mapToOption,
    renderOption: (user: SearchOption<User>) => <UserBadge user={user.data} />,
    renderMultiValue: (user: SearchOption<User>) => (
      <UserBadge user={user.data} micro />
    ),
  };

  if (props.mode === "single") {
    return (
      <Search
        {...searchProps}
        mode="single"
        value={props.value}
        onChange={props.onChange}
      />
    );
  }

  return (
    <Search
      {...searchProps}
      mode="multiple"
      value={props.value}
      onChange={props.onChange}
    />
  );
};

export default MemberSearch;
