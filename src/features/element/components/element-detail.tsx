import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  color: string;
}

const ElementDetail = ({ icon: Icon, title, children, color }: Props) => {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-6 w-6 flex-shrink-0" color={color} />
      <div>
        <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
          {title}
        </h3>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
};

export default ElementDetail;
