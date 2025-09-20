import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { LabelProps } from "@radix-ui/react-label";

interface Props extends LabelProps {
  isRequired?: boolean;
  children: React.ReactNode;
  showInfoButton?: boolean;
  infoContent?: React.ReactNode;
}
const FieldLabel = ({
  isRequired,
  showInfoButton,
  infoContent,
  children,
}: Props) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-start gap-2">
        <Label>{children}</Label>
        <span
          className={cn(
            "text-muted-foreground text-sm",
            !isRequired && "italic",
          )}
        >
          {isRequired ? "*" : "(optional)"}
        </span>
      </div>
    </div>
  );
};

export default FieldLabel;
