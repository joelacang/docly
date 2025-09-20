import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { SIZE } from "@/types";
import type { WorkspacePreview } from "@/types/workspace";
import { Colors } from "@/utils/colors";
import { getAvatarSize, getAvatarText } from "@/utils/sizes";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  workspace: WorkspacePreview;
  size?: SIZE;
  disabled?: boolean;
  isCurrent?: boolean;
}
const WorkspaceAvatar = ({
  workspace,
  size = SIZE.MEDIUM,
  disabled = false,
  isCurrent = false,
}: Props) => {
  const avatarSize = getAvatarSize(size);
  const textSize = getAvatarText(size);
  const color = Colors[workspace.element.color];
  const router = useRouter();

  return (
    <Hint tooltip={workspace.element.name} side="right">
      <Button
        className={cn(
          avatarSize,
          "cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ease-in-out",
          "hover:scale-110 hover:rounded-sm hover:shadow-lg hover:shadow-black/20",
          "active:scale-95 active:shadow-inner",
          "transform-gpu", // Hardware acceleration for smoother animations
          isCurrent &&
            !disabled && [
              "ring-offset-background ring-3 ring-emerald-500 ring-offset-2",
              "shadow-lg shadow-blue-500/20",
              "rounded-sm",
            ],
          disabled && "pointer-events-none",
        )}
        variant="ghost"
        size="icon"
        onClick={() => {
          router.push(`/Workspace/${workspace.element.slug}`);
        }}
      >
        {workspace.element.avatarUrl ? (
          <div className="relative aspect-square w-full transition-all duration-300">
            <Image
              className={cn(
                "object-cover transition-all duration-300 hover:scale-105",
              )}
              fill
              src={workspace.element.avatarUrl}
              alt={`${workspace.element.name} Image`}
            />
            {/* Overlay effect on hover */}
            <div
              className={cn(
                "absolute inset-0 bg-black/0 transition-all duration-300 hover:bg-black/10",
                isCurrent && !disabled && "bg-green-500/10",
              )}
            />
          </div>
        ) : (
          <div
            className={cn(
              "flex items-center justify-center transition-all duration-300",
              "hover:brightness-110",
              isCurrent && !disabled && "brightness-110",
              avatarSize,
            )}
            style={{
              backgroundImage: `linear-gradient(to bottom, ${color.primary}, ${color.darkest})`,
            }}
          >
            <p
              className={cn(
                "font-sans font-bold text-white transition-all duration-300",
                "hover:scale-110 hover:text-shadow-sm",
                textSize,
              )}
            >
              {workspace.element.name.charAt(0).toUpperCase()}
            </p>
          </div>
        )}
      </Button>
    </Hint>
  );
};

export default WorkspaceAvatar;
