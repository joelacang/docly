import AlertMessage from "@/components/messages/alert-message";
import UserBadge from "@/features/users/user-badge";
import { useDebounced } from "@/hooks/use-debounce";
import useSelectStyles from "@/styles/react-select";
import { api } from "@/trpc/react";
import type { MemberOption } from "@/types/member";
import { SearchXIcon } from "lucide-react";
import { useMemo, useState } from "react";
import Select, {
  type MultiValue,
  type MultiValueProps,
  type OptionProps,
  type SingleValue,
  type StylesConfig,
  components,
} from "react-select";

interface BaseMemberSearchProps {
  workspaceId: string;
  teamId?: string;
  disabled?: boolean;
  placeholder?: string;
}

interface SingleMemberSearchProps extends BaseMemberSearchProps {
  mode: "single";
  value: MemberOption | null;
  onChange: (member: MemberOption | null) => void;
}

interface MultipleMemberSearchProps extends BaseMemberSearchProps {
  mode: "multiple";
  value: MemberOption[];
  onChange: (members: MemberOption[]) => void;
}

type MemberSearchProps = SingleMemberSearchProps | MultipleMemberSearchProps;

const MemberSearch = (props: MemberSearchProps) => {
  const {
    workspaceId,
    teamId,
    value,
    mode,
    onChange,
    disabled,
    placeholder = "Enter Member To Search...",
  } = props;

  const [enteredText, setEnteredText] = useState("");
  const searchValue = useDebounced(enteredText.trim(), 500);
  const styles = useSelectStyles();

  const { data: fetchedMembers = [], isLoading } =
    api.membership.searchMember.useQuery(
      { workspaceId, searchValue },
      { enabled: !!searchValue },
    );

  const options: MemberOption[] = useMemo(() => {
    return fetchedMembers.map((m) => ({
      value: m.id,
      label: m.name,
      member: m,
    }));
  }, [fetchedMembers]);

  const handleChange = (
    newValue: SingleValue<MemberOption> | MultiValue<MemberOption>,
  ) => {
    if (mode === "multiple") {
      onChange(newValue as MemberOption[]);
    } else {
      onChange(newValue as MemberOption | null);
    }
  };

  const handleInputChange = (inputValue: string) => {
    setEnteredText(inputValue);
  };

  const CustomOption = (props: OptionProps<MemberOption, boolean>) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        className="hover:bg-muted cursor-pointer p-2"
        ref={innerRef}
        {...innerProps}
      >
        <UserBadge user={data.member} />
      </div>
    );
  };

  const MultiValueComponent = (props: MultiValueProps<MemberOption>) => {
    return (
      <components.MultiValue {...props}>
        <div>
          <UserBadge user={props.data.member} micro />
        </div>
      </components.MultiValue>
    );
  };

  const NoOptionsMessage = () => {
    return (
      <div className="text-muted-foreground px-2 py-1 text-sm">
        {searchValue.length === 0 ? (
          <div>
            <AlertMessage
              title="No Search Input"
              description="Enter Member Name To Start Searching"
              icon={SearchXIcon}
            />
          </div>
        ) : (
          <>
            No Members found for{" "}
            <span className="text-primary font-medium">
              &quot;{searchValue}&quot;
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <Select
      className="w-full"
      isMulti={mode === "multiple"}
      styles={styles}
      options={options}
      onChange={handleChange}
      inputId="member-search"
      inputValue={enteredText}
      value={value}
      onInputChange={handleInputChange}
      closeMenuOnSelect={mode === "single"}
      isLoading={isLoading}
      placeholder={placeholder}
      isDisabled={disabled}
      isClearable
      getOptionLabel={(opt) => opt.label}
      getOptionValue={(opt) => opt.value}
      components={{
        Option: CustomOption,
        MultiValue: MultiValueComponent,
        IndicatorSeparator: null,
        DropdownIndicator: null,
        NoOptionsMessage,
      }}
    />
  );
};

export default MemberSearch;
