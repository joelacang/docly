"use client";

import LoadingToastMessage from "@/components/custom/loading-toast-message";
import ToastMessage from "@/components/custom/toast-message";
import Centered from "@/components/layout/centered";
import ErrorMessage from "@/components/messages/error-message";
import LoadingMessage from "@/components/messages/loading-message";
import { api } from "@/trpc/react";
import { Mode } from "@/types";
import type { WorkspaceMembership } from "@/types/workspace";
import { useParams, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useMyTeams } from "./team-provider";

type WorkspaceContext = {
  myWorkspaces: WorkspaceMembership[];
  currentWorkspace: WorkspaceMembership | null;
  baseUrl: string;
  isSwitching: boolean;
  setCurrentWorkspace: (workspace: WorkspaceMembership | null) => void;
  onSwitchWorkspace: (workspace: WorkspaceMembership) => void;
};

const WorkspaceContext = createContext<WorkspaceContext | null>(null);

export const useMyWorkspaces = () => {
  const ctx = useContext(WorkspaceContext);

  if (!ctx) {
    throw new Error("useMyWorkspaces must be used within WorkspaceProvider");
  }

  return ctx;
};

interface Props {
  children: React.ReactNode;
}

export const WorkspaceProvider = ({ children }: Props) => {
  const [currentWorkspace, setCurrentWorkspace] =
    useState<WorkspaceMembership | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const { workspaceSlug } = useParams();
  const router = useRouter();

  const { data, isLoading, isError, error } =
    api.workspace.getMyWorkspaces.useQuery();
  const { mutate: setLastWorkspaceVisited } =
    api.workspace.setLastWorkspaceVisited.useMutation();

  const baseUrl = currentWorkspace
    ? `/workspace/${currentWorkspace.workspace.element.slug}`
    : "/";

  const onSwitchWorkspace = useCallback(
    (workspace: WorkspaceMembership) => {
      if (isSwitching) return;

      const switchToast = toast.custom(() => (
        <LoadingToastMessage message="Switching Workspace..." />
      ));

      setIsSwitching(true);

      setLastWorkspaceVisited(
        { workspaceId: workspace.workspace.id },
        {
          onSuccess: () => {
            toast.custom(() => (
              <ToastMessage
                title="Workspace Switched"
                message={`Workspace has been switched to: ${workspace.workspace.element.name}`}
                mode={Mode.SUCCESS}
              >
                <p className="text-muted-foreground text-xs">
                  Last Team Selected Id: {workspace.lastTeamSelected ?? "NONE"}
                </p>
              </ToastMessage>
            ));
            router.push(`/workspace/${workspace.workspace.element.slug}`);
          },
          onError: (error) => {
            toast.custom(() => (
              <ToastMessage
                title="Error switching workspace."
                message={error.message}
                mode={Mode.ERROR}
              />
            ));
          },
          onSettled: () => {
            setIsSwitching(false);
            toast.dismiss(switchToast);
          },
        },
      );
    },
    [isSwitching, router, setLastWorkspaceVisited, setIsSwitching],
  );

  const contextValue: WorkspaceContext = useMemo(
    () => ({
      myWorkspaces: data?.myWorkspaces ?? [],
      baseUrl,
      currentWorkspace,
      isSwitching,
      setCurrentWorkspace,
      onSwitchWorkspace,
    }),
    [
      data?.myWorkspaces,
      currentWorkspace,
      onSwitchWorkspace,
      baseUrl,
      isSwitching,
    ],
  );

  useEffect(() => {
    if (isLoading || !data?.myWorkspaces) return;

    if (workspaceSlug) {
      const found = data.myWorkspaces.find(
        (w) => w.workspace.element.slug === workspaceSlug,
      );

      if (found) {
        setCurrentWorkspace(found);
        setLastWorkspaceVisited({ workspaceId: found.workspace.id });
      }
    } else {
      const lastVisited = data.myWorkspaces[0];

      if (lastVisited) {
        router.push(`/workspace/${lastVisited.workspace.element.slug}`);
      } else {
        router.push(`/no-workspace`);
      }
    }
  }, [
    workspaceSlug,
    isLoading,
    data,
    router,
    currentWorkspace,
    setLastWorkspaceVisited,
  ]);

  if (isLoading) {
    return <LoadingMessage message="Loading Your Workspaces..." />;
  }

  if (isError) {
    return (
      <Centered>
        <ErrorMessage
          message="Error loading your workspaces"
          description={error.message}
        />
      </Centered>
    );
  }

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};
