import InfoMessage from "@/components/messages/info-message";
import { Button } from "@/components/ui/button";
import JoinWorkspaceButton from "@/features/membership/components/join-workspace/join-workspace-button";
import { HomeIcon } from "lucide-react";
import { useRouter } from "next/router";

interface Props {
  workspaceId: string;
}
const UnauthorizedMessage = ({ workspaceId }: Props) => {
  const router = useRouter();
  return (
    <InfoMessage
      imageUrl="/images/unauthorized.png"
      message="You are not authorized to access this workspace."
      className="flex flex-row items-center justify-center gap-4"
    >
      <JoinWorkspaceButton workspaceId={workspaceId} />
      <Button onClick={() => router.push(`/`)}>
        <HomeIcon />
        Go Home
      </Button>
    </InfoMessage>
  );
};

export default UnauthorizedMessage;
