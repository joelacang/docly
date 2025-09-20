import { cn } from "@/lib/utils";
import Image from "next/image";
import type { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  imageUrl?: string;
  message: string;
  children?: React.ReactNode;
  mode?: "info" | "error";
  className?: string;
}

const InfoMessage = ({
  imageUrl,
  message,
  children,
  className,
  mode = "info",
  ...props
}: Props) => {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      {imageUrl && (
        <div className="relative aspect-video w-full max-w-xs">
          <Image
            fill
            className="object-cover"
            src={imageUrl}
            alt="Empty state illustration"
          />
        </div>
      )}
      <div className="max-w-[480px] space-y-3 pt-4">
        <p
          className={cn(
            "font-sans text-lg leading-relaxed font-semibold",
            mode === "info" ? "text-muted-foreground" : "text-destructive",
          )}
        >
          {message}
        </p>
        <div className={cn("pt-4", className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
};
export default InfoMessage;
