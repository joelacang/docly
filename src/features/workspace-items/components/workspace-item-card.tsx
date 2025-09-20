import type { CollectionDisplay, ElementDisplay } from "@/types/element";
import { Colors } from "@/utils/colors";
import type { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  item: ElementDisplay | CollectionDisplay;
  onClick: () => void;
}

const WorkspaceItemCard = ({ item, onClick }: Props) => {
  const color = Colors[item.color];

  return (
    <div
      className="flex h-24 w-28 cursor-pointer flex-col items-center justify-start gap-4 rounded-lg p-4 transition-all duration-200 hover:scale-105 active:scale-95"
      onClick={onClick}
      style={
        {
          "--active-color": color.lightest,
          "--hover-border": color.light,
        } as React.CSSProperties
      }
    >
      {/* Icon container - fixed height */}
      <div className="flex h-8 items-center justify-center">
        <item.icon
          color={color.primary}
          fill={color.light}
          className="size-8 shrink-0 transition-transform"
        />
      </div>

      {/* Text container - flexible but constrained */}
      <div className="flex w-full items-end justify-center">
        <p
          className="text-muted-foreground line-clamp-2 text-center text-sm leading-tight font-semibold"
          style={{
            hyphens: "auto",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {item.label}
        </p>
      </div>
    </div>
  );
};

export default WorkspaceItemCard;
