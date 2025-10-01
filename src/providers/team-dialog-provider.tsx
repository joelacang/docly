"use client";
import AddTeamMemberDialog from "@/features/teams/components/team-memberships/add-team-members-dialog";
import { useIsMounted } from "@/hooks/use-is-mounted";

const TeamDialogProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <>
      <AddTeamMemberDialog />
    </>
  );
};

export default TeamDialogProvider;
