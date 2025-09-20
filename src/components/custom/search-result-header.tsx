interface Props {
  count: number;
  searchValue: string;
}

const SearchResultHeader = ({ count, searchValue }: Props) => {
  return (
    <div>
      <h4 className="pb-4 font-sans text-base">
        <span className="font-semibold">{count}&nbsp;</span>Result
        {count !== 1 ? "s " : " "}
        for the name &apos;
        <span className="font-semibold text-blue-500">{searchValue}</span>
        &apos;:
      </h4>
    </div>
  );
};

export default SearchResultHeader;
