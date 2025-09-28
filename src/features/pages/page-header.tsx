interface Props {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, children }: Props) => {
  return (
    <div className="@container w-full">
      <div className="px-4 pt-8 pb-12">
        <div className="flex items-center justify-between">
          <div className="w-full space-y-1">
            <h1 className="text-foreground text-2xl font-bold @3xl:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground text-base @3xl:text-lg">
                {subtitle}
              </p>
            )}
          </div>

          {children && <div className="ml-8 flex-shrink-0">{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
