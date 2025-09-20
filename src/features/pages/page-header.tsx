interface Props {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, children }: Props) => {
  return (
    <div className="w-full border-gray-200">
      <div className="px-6 py-8 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>

          {children && <div className="ml-8 flex-shrink-0">{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
