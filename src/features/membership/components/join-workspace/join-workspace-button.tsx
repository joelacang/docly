import ToastMessage from "@/components/custom/toast-message";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Mode } from "@/types";
import {
  ArrowRightIcon,
  Loader2Icon,
  UserCheckIcon,
  UserPlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useJoinWorkspaceDialog } from "../../hooks/use-join-workspace-dialog";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import type { WorkspaceMembership } from "@/types/workspace";

interface Props {
  workspaceId: string;
  label?: string;
}
const JoinWorkspaceButton = ({ workspaceId, label = "Join" }: Props) => {
  const [isJoined, setIsJoined] = useState(false);
  const { setCurrentWorkspace } = useMyWorkspaces();
  const { onPending, onCompleted } = useJoinWorkspaceDialog();
  const router = useRouter();
  const { mutate: joinWorkspace, isPending } =
    api.membership.join.useMutation();
  const apiUtils = api.useUtils();

  const handleJoinWorkspace = () => {
    const joinToast = toast.loading(`Joining Workspace...`);
    onPending();

    joinWorkspace(
      { workspaceId },
      {
        onSuccess: (response) => {
          const { id, role, status, joinDate, workspace, member } = response;

          const newData = {
            workspace,
            membership: { id, role, status },
          } as WorkspaceMembership;

          toast.custom(() => (
            <ToastMessage
              title={`Successfully joined ${workspace.element.name}`}
              message={`Congratulations! You are now a member of ${workspace.element.name}. Click 'Go To Workspace' to start working.`}
              mode={Mode.SUCCESS}
            />
          ));

          apiUtils.workspace.getMyWorkspaces.setData(undefined, (prev) => {
            if (!prev) return prev;

            const updatedMyWorkspaces = [...prev.myWorkspaces, newData];
            return { ...prev, myWorkspaces: updatedMyWorkspaces };
          });

          apiUtils.membership.getMembers.setData(
            { workspaceId: workspace.id },
            (prev) => {
              if (!prev) return [];

              const updatedMembers = [
                ...prev,
                { id, role, status, member, joinDate },
              ];

              return updatedMembers;
            },
          );
          setIsJoined(true);
          setCurrentWorkspace(newData);
        },
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              title={`Error joining workspace.`}
              message={error.message}
              mode={Mode.ERROR}
            />
          ));
        },
        onSettled: () => {
          toast.dismiss(joinToast);
          onCompleted();
        },
      },
    );
  };
  return (
    <Button
      type="button"
      variant="blue"
      disabled={isPending || isJoined}
      onClick={handleJoinWorkspace}
    >
      {isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : isJoined ? (
        <UserCheckIcon />
      ) : (
        <UserPlusIcon />
      )}
      {isPending ? `Joining...` : isJoined ? "Joined" : label}
    </Button>
  );
};

export default JoinWorkspaceButton;
