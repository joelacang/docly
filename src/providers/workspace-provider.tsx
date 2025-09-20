"use client";

import Centered from "@/components/layout/centered";
import ErrorMessage from "@/components/messages/error-message";
import LoadingMessage from "@/components/messages/loading-message";
import { api } from "@/trpc/react";
import type { WorkspaceMembership } from "@/types/workspace";
import { createContext, useContext, useEffect, useState } from "react";

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
  const [myWorkspaces, setMyWorkspaces] = useState<WorkspaceMembership[]>([]);
  const [currentWorkspace, setCurrentWorkspace] =
    useState<WorkspaceMembership | null>(null);

  const onClear = () => {
    setMyWorkspaces([]);
    setCurrentWorkspace(null);
  };

  const { data, isLoading, isError, error } =
    api.workspace.getMyWorkspaces.useQuery();

  useEffect(() => {
    if (!data) return;

    setMyWorkspaces(data);
  }, [data]);

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
    <WorkspaceContext.Provider
      value={{ myWorkspaces, onClear, currentWorkspace, setCurrentWorkspace }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
