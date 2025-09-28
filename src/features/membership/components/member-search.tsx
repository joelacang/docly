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
  type StylesConfig,
  components,
} from "react-select";

interface Props {
  workspaceId: string;
  value: MemberOption[];
  onChange: (members: MemberOption[]) => void;
  disabled?: boolean;
  placeholder?: string;
}
const MemberSearch = ({
  workspaceId,
  value,
  onChange,
  disabled,
  placeholder = "Enter Member To Search...",
}: Props) => {
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

  const handleChange = (options: MultiValue<MemberOption>) => {
    onChange(options as MemberOption[]);
  };

  const handleInputChange = (inputValue: string) => {
    setEnteredText(inputValue);
  };

  const CustomOption = (props: OptionProps<MemberOption, true>) => {
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
      isMulti
      styles={styles}
      options={options}
      onChange={handleChange}
      inputId="member-search"
      inputValue={enteredText}
      defaultValue={value}
      onInputChange={handleInputChange}
      closeMenuOnSelect={false}
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
