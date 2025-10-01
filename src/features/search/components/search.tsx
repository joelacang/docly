import ToastMessage from "@/components/custom/toast-message";
import AlertMessage from "@/components/messages/alert-message";
import { useDebounced } from "@/hooks/use-debounce";
import type { AppRouter } from "@/server/api/root";
import useSelectStyles from "@/styles/react-select";
import type { SearchOption } from "@/types";
import type { TRPCClientError, TRPCClientErrorLike } from "@trpc/client";
import type { TRPCError } from "@trpc/server";
import { SearchXIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type {
  MultiValue,
  MultiValueProps,
  OptionProps,
  SingleValue,
  SingleValueProps,
} from "react-select";
import Select, { components } from "react-select";

interface BaseSearchProps<TData> {
  disabled?: boolean;
  placeholder?: string;
  // Function to fetch data - can be any API call
  useSearchQuery: (searchValue: string) => {
    data: TData[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: TRPCClientErrorLike<AppRouter> | null;
  };
  // Function to transform fetched data into options
  mapToOption: (item: TData) => SearchOption<TData>;
  // Optional custom render for options
  renderOption?: (option: SearchOption<TData>) => React.ReactNode;
  // Optional custom render for selected values in multi mode
  renderMultiValue?: (option: SearchOption<TData>) => React.ReactNode;
  renderSingleValue?: (option: SearchOption<TData>) => React.ReactNode;
}

interface SingleSearchProps<TData> extends BaseSearchProps<TData> {
  mode: "single";
  value: SearchOption<TData> | null;
  onChange: (option: SearchOption<TData> | null) => void;
}

interface MultipleSearchProps<TData> extends BaseSearchProps<TData> {
  mode: "multiple";
  value: SearchOption<TData>[];
  onChange: (options: SearchOption<TData>[]) => void;
}

type SearchProps<TData> = SingleSearchProps<TData> | MultipleSearchProps<TData>;

const Search = <TData,>(props: SearchProps<TData>) => {
  const {
    value,
    mode,
    onChange,
    disabled,
    placeholder = "Enter to search...",
    useSearchQuery,
    mapToOption,
    renderOption,
    renderMultiValue,
    renderSingleValue,
  } = props;

  const [enteredText, setEnteredText] = useState("");
  const searchValue = useDebounced(enteredText.trim(), 500);
  const styles = useSelectStyles<SearchOption<TData>>();

  const {
    data: fetchedData = [],
    isLoading,
    isError: isFetchError,
    error: fetchError,
  } = useSearchQuery(searchValue);

  const options: SearchOption<TData>[] = useMemo(() => {
    return fetchedData.map(mapToOption);
  }, [fetchedData, mapToOption]);

  useEffect(() => {
    if (isFetchError) {
      console.error(fetchError);
      toast.custom(() => (
        <ToastMessage
          title="Error fetching search results."
          message={fetchError?.message ?? "An unknown error occurred."}
        />
      ));
    }
  }, [isFetchError, fetchError]);

  const handleChange = (
    newValue:
      | SingleValue<SearchOption<TData>>
      | MultiValue<SearchOption<TData>>,
  ) => {
    if (mode === "multiple") {
      onChange(newValue as SearchOption<TData>[]);
    } else {
      onChange(newValue as SearchOption<TData> | null);
    }
  };

  const handleInputChange = (inputValue: string) => {
    setEnteredText(inputValue);
  };

  const CustomOption = (props: OptionProps<SearchOption<TData>, boolean>) => {
    const { data, innerRef, innerProps } = props;

    if (renderOption) {
      return (
        <div
          className="hover:bg-muted cursor-pointer p-2"
          ref={innerRef}
          {...innerProps}
        >
          {renderOption(data)}
        </div>
      );
    }

    return (
      <div
        className="hover:bg-muted cursor-pointer p-2"
        ref={innerRef}
        {...innerProps}
      >
        {data.label}
      </div>
    );
  };

  const MultiValueComponent = (props: MultiValueProps<SearchOption<TData>>) => {
    if (renderMultiValue) {
      return (
        <components.MultiValue {...props}>
          <div>{renderMultiValue(props.data)}</div>
        </components.MultiValue>
      );
    }

    return <components.MultiValue {...props} />;
  };

  const SingleValueComponent = (
    props: SingleValueProps<SearchOption<TData>>,
  ) => {
    if (renderSingleValue) {
      return (
        <components.SingleValue {...props}>
          <div>{renderSingleValue(props.data)}</div>
        </components.SingleValue>
      );
    }
  };

  const NoOptionsMessage = () => {
    return (
      <div className="text-muted-foreground px-2 py-1 text-sm">
        {searchValue.length === 0 ? (
          <div>
            <AlertMessage
              title="No Search Input"
              description="Enter text to start searching"
              icon={SearchXIcon}
            />
          </div>
        ) : (
          <>
            No results found for{" "}
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
      inputId="search-input"
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
        SingleValue: SingleValueComponent,
        IndicatorSeparator: null,
        DropdownIndicator: null,
        NoOptionsMessage,
      }}
    />
  );
};

export default Search;
