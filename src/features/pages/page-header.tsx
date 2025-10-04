interface Props {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  settings?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, children, settings, icon }: Props) => {
  return (
    <div className="@container w-full">
      <div className="px-4 pt-8 pb-12">
        <div className="flex w-full flex-row items-start justify-between gap-8">
          <div className="flex flex-1 flex-row items-start justify-start gap-4">
            {icon && <div>{icon}</div>}
            <div className="w-full space-y-1">
              <h1 className="text-foreground text-2xl font-bold @3xl:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground line-clamp-2 text-base @3xl:text-lg">
                  {subtitle}
                </p>
              )}
              {children && <div>{children}</div>}
            </div>
          </div>

          {settings && <div>{settings}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
