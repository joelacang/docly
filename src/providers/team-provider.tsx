"use client";

import LoadingMessage from "@/components/messages/loading-message";
import { api } from "@/trpc/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import type { MyTeamMembership } from "@/types/team";
import { useParams, useRouter } from "next/navigation";
import { useMyWorkspaces } from "./workspace-provider";
import ToastMessage from "@/components/custom/toast-message";
import LoadingToastMessage from "@/components/custom/loading-toast-message";
import { Mode } from "@/types";

type TeamContext = {
  myTeams: MyTeamMembership[];
  currentTeam: MyTeamMembership | null;
  baseTeamUrl: string;
  isSwitchingTeam: boolean;
  onSwitchTeam: (team: MyTeamMembership) => void;
  onSwitchDefaultTeam: () => void;
  onClearTeam: () => void;
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
  const { data, isLoading, isError, error } = api.team.getMyTeams.useQuery({
    workspaceId,
  });

  const { mutate: setLastTeamSelected } =
    api.team.setLastTeamSelected.useMutation();

  const [currentTeam, setCurrentTeam] = useState<MyTeamMembership | null>(null);
  const [isSwitchingTeam, setIsSwitchingTeam] = useState(false);

  const { baseUrl, isWorkspaceSwitched, setIsWorkspaceSwitched } =
    useMyWorkspaces();
  const { teamSlug } = useParams();
  const router = useRouter();
  const baseTeamUrl = useMemo(() => {
    if (!currentTeam) return "";
    return `${baseUrl}/team/${currentTeam.team.element.slug}`;
  }, [baseUrl, currentTeam]);

  const onClearTeam = useCallback(() => {
    setCurrentTeam(null);
  }, []);

  const onSwitchTeam = useCallback(
    (team: MyTeamMembership) => {
      if (isSwitchingTeam) return;

      const switchToast = toast.custom(() => (
        <LoadingToastMessage message="Switching Team..." />
      ));

      setIsSwitchingTeam(true);

      setLastTeamSelected(
        { workspaceId, teamId: team.team.id },
        {
          onSuccess: () => {
            setCurrentTeam(team);
            toast.custom(() => (
              <ToastMessage
                title="Team switched."
                message={`Team switched to ${team.team.element.name}`}
                mode={Mode.SUCCESS}
              />
            ));
            router.push(`${baseUrl}/team/${team.team.element.slug}`);
          },
          onError: (error) => {
            toast.custom(() => (
              <ToastMessage
                title="Error switching team."
                message={error.message}
                mode={Mode.ERROR}
              />
            ));
          },
          onSettled: () => {
            toast.dismiss(switchToast);
            setIsSwitchingTeam(false);
          },
        },
      );
    },
    [router, isSwitchingTeam, workspaceId, setLastTeamSelected],
  );

  const onSwitchDefaultTeam = useCallback(() => {
    const defaultTeam = data?.lastTeamSelected;

    if (defaultTeam) {
      setCurrentTeam(defaultTeam);
    } else {
      setCurrentTeam(null);
    }
  }, [data?.lastTeamSelected]);

  const contextValue = useMemo(
    () => ({
      myTeams: data?.myTeams ?? [],
      currentTeam,
      baseTeamUrl,
      isSwitchingTeam,
      onSwitchTeam,
      onClearTeam,
      onSwitchDefaultTeam,
    }),
    [
      data?.myTeams,
      currentTeam,
      baseTeamUrl,
      isSwitchingTeam,
      onSwitchTeam,
      onClearTeam,
      onSwitchDefaultTeam,
    ],
  );

  useEffect(() => {
    if (isLoading || !data) return;

    if (teamSlug) {
      const foundTeam = data.myTeams.find(
        (t) => t.team.element.slug === teamSlug,
      );

      if (
        foundTeam &&
        foundTeam.team.element.slug !== currentTeam?.team.element.slug
      ) {
        setCurrentTeam(foundTeam);
        if (
          data.lastTeamSelected &&
          foundTeam.team.id !== data.lastTeamSelected?.team.id
        ) {
          setLastTeamSelected({ workspaceId, teamId: foundTeam.team.id });
        }
      }
      return;
    }

    onSwitchDefaultTeam();
  }, [
    teamSlug,
    data,
    currentTeam,
    isLoading,
    workspaceId,
    onSwitchDefaultTeam,
    setLastTeamSelected,
  ]);

  useEffect(() => {
    if (isError) {
      toast.error(`Error loading Teams: ${error.message}`);
    }
  }, [isError, error?.message]);

  useEffect(() => {
    if (!isWorkspaceSwitched) return;

    onClearTeam();
    onSwitchDefaultTeam();
    setIsWorkspaceSwitched(false);
  }, [
    isWorkspaceSwitched,
    setIsWorkspaceSwitched,
    onSwitchDefaultTeam,
    onClearTeam,
  ]);

  if (isLoading) {
    return <LoadingMessage message="Loading Your Teams..." />;
  }

  return (
    <TeamContext.Provider value={contextValue}>{children}</TeamContext.Provider>
  );
};

TeamContext.displayName = "TeamContext";
