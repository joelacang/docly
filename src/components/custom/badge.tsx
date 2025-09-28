import { Colors } from "@/utils/colors";
import type { IconDisplay } from "@/utils/icon";

interface Props {
  display: IconDisplay;
  children: React.ReactNode;
}

const Badge = ({ display, children }: Props) => {
  const badgeColor = Colors[display.color] ?? "BLUE";
  const Icon = display.icon;
  return (
    <div
      style={
        {
          "--icon-light": badgeColor.light,
          "--icon-primary": badgeColor.primary,
          "--icon-darkest": badgeColor.darkest,
        } as React.CSSProperties
      }
      className="flex h-fit w-fit cursor-pointer items-center justify-center rounded-full border border-[_var(--icon-primary)] bg-[_var(--icon-light)] px-2 text-[_var(--icon-primary)] dark:bg-[_var(--icon-darkest)]"
    >
      <div
        className="flex flex-row items-center justify-center gap-1 px-2 py-0.5 text-xs font-medium text-[_var(--text-primary)] dark:text-[_var(--text-lightest)]"
        style={
          {
            "--text-primary": badgeColor.primary,
            "--text-lightest": badgeColor.lightest,
          } as React.CSSProperties
        }
      >
        {Icon && <Icon className="size-3" />}
        {children}
      </div>
    </div>
  );
};

export default Badge;
