import LoadingMessage from "@/components/messages/loading-message";
import { api } from "@/trpc/react";
import { createContext, useContext, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useMyWorkspaces } from "./workspace-provider";
import type { MyTeamMembership } from "@/types/team";

type TeamContext = {
  myTeams: MyTeamMembership[];
};

const TeamContext = createContext<TeamContext | null>(null);

export const useMyTeams = () => {
  const ctx = useContext(TeamContext);

  if (!ctx) {
    throw new Error("useMyTeams must be used within TeamProvider.");
  }

  return ctx;
};

interface Props {
  children: React.ReactNode;
  workspaceId: string;
}

export const TeamProvider = ({ children, workspaceId }: Props) => {
  const {
    data: teams,
    isLoading,
    isError,
    error,
  } = api.team.getMyTeams.useQuery({
    workspaceId,
  });

  const contextValue = useMemo(
    () => ({
      myTeams: teams ?? [],
    }),
    [teams],
  );

  useEffect(() => {
    if (isError) {
      toast.error(`Error loading Teams: ${error.message}`);
    }
  }, [isError]);

  if (isLoading) {
    return <LoadingMessage message="Loading Your Teams..." />;
  }

  return (
    <TeamContext.Provider value={contextValue}>{children}</TeamContext.Provider>
  );
};
