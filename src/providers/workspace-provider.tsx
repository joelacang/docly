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
  isWorkspaceSwitched: boolean;
  setCurrentWorkspace: (workspace: WorkspaceMembership | null) => void;
  setIsWorkspaceSwitched: (status: boolean) => void;
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
  const [isWorkspaceSwitched, setIsWorkspaceSwitched] = useState(false);

  const { workspaceSlug } = useParams();
  const router = useRouter();

  const { data, isLoading, isError, error } =
    api.workspace.getMyWorkspaces.useQuery();
  const { mutate: setLastWorkspaceVisited } =
    api.workspace.setLastWorkspaceVisited.useMutation();

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
              />
            ));
            setCurrentWorkspace(workspace);
            setIsWorkspaceSwitched(true);
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
    [
      isSwitching,
      router,
      setLastWorkspaceVisited,
      setCurrentWorkspace,
      setIsSwitching,
      setIsWorkspaceSwitched,
    ],
  );

  const baseUrl = currentWorkspace
    ? `/workspace/${currentWorkspace.workspace.element.slug}`
    : "/";

  const contextValue: WorkspaceContext = useMemo(
    () => ({
      myWorkspaces: data?.myWorkspaces ?? [],
      baseUrl,
      currentWorkspace,
      isSwitching,
      isWorkspaceSwitched,
      setIsWorkspaceSwitched,
      setCurrentWorkspace,
      onSwitchWorkspace,
    }),
    [
      data?.myWorkspaces,
      currentWorkspace,
      onSwitchWorkspace,
      baseUrl,
      isSwitching,
      isWorkspaceSwitched,
      setIsWorkspaceSwitched,
    ],
  );

  useEffect(() => {
    if (isLoading || !data?.myWorkspaces) return;

    if (workspaceSlug) {
      const found = data.myWorkspaces.find(
        (w) => w.workspace.element.slug === workspaceSlug,
      );

      if (
        found &&
        found.workspace.element.slug !==
          currentWorkspace?.workspace.element.slug
      ) {
        setCurrentWorkspace(found);
        setLastWorkspaceVisited({ workspaceId: found.workspace.id });
      }
    } else {
      const targetSlug = data.myWorkspaces[0]?.workspace.element.slug;

      if (targetSlug) {
        router.push(`/workspace/${targetSlug}`);
      } else {
        router.push("/no-workspace");
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
