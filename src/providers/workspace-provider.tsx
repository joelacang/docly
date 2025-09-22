"use client";

import Centered from "@/components/layout/centered";
import ErrorMessage from "@/components/messages/error-message";
import LoadingMessage from "@/components/messages/loading-message";
import NoWorkspaceMessage from "@/features/workspaces/components/messages/no-workspace-message";
import { api } from "@/trpc/react";
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

type WorkspaceContext = {
  myWorkspaces: WorkspaceMembership[];
  onClear: () => void;
  currentWorkspace: WorkspaceMembership | null;
  setCurrentWorkspace: (workspace: WorkspaceMembership | null) => void;
};

const WorkspaceContext = createContext<WorkspaceContext | null>(null);

export const useMyWorkspaces = () => {
  const ctx = useContext(WorkspaceContext);

  if (!ctx)
    throw new Error("useMyWorkspaces must be used within WorkspaceProvider");

  return ctx;
};

interface Props {
  children: React.ReactNode;
}

export const WorkspaceProvider = ({ children }: Props) => {
  const [currentWorkspace, setCurrentWorkspace] =
    useState<WorkspaceMembership | null>(null);
  const { workspaceSlug } = useParams();
  const router = useRouter();

  const onClear = useCallback(() => {
    setCurrentWorkspace(null);
  }, []);

  const { data, isLoading, isError, error } =
    api.workspace.getMyWorkspaces.useQuery();

  const contextValue = useMemo(
    () => ({
      myWorkspaces: data?.myWorkspaces ?? [],
      onClear,
      currentWorkspace,
      setCurrentWorkspace,
    }),
    [data?.myWorkspaces, onClear, currentWorkspace],
  );

  useEffect(() => {
    if (isLoading || !data?.myWorkspaces) return;

    if (workspaceSlug) {
      const foundWorkspace = data.myWorkspaces.find(
        (w) => w.workspace.element.slug === workspaceSlug,
      );
      setCurrentWorkspace(foundWorkspace ?? null);
      return;
    }

    const targetSlug =
      data.lastWorkspaceVisited ?? data.myWorkspaces[0]?.workspace.element.slug;

    if (targetSlug) {
      router.push(`/workspace/${targetSlug}`);
    } else {
      router.push("/no-workspace"); // ✅ Fixed: removed "-found"
    }
  }, [data, workspaceSlug, isLoading, router]);

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
