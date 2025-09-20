import { cn } from "@/lib/utils";
import { SIZE } from "@/types";
import { getAvatarText } from "@/utils/sizes";

interface Props {
  size?: SIZE;
  subtitle?: boolean;
}

const Logo = ({ size = SIZE.MEDIUM, subtitle = false }: Props) => {
  const currentSize = getAvatarText(size);
  return (
    <div className="flex flex-col items-center justify-center">
      <p className={cn(currentSize, "text-primary text-center font-black")}>
        docly
      </p>
      {subtitle && (
        <p className="text-muted-foreground text-center text-sm">
          Organize your documents
        </p>
      )}
    </div>
  );
};

export default Logo;
