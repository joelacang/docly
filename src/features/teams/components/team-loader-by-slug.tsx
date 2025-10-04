import { QueryStateHandler } from "@/components/query-state-handler";
import PageHeader from "@/features/pages/page-header";
import { api } from "@/trpc/react";
import TeamAvatar from "./team-avatar";
import { SIZE } from "@/types";
import InfoMessage from "@/components/messages/info-message";
import { TeamAccess } from "@/types/team";
import Centered from "@/components/layout/centered";

interface Props {
  slug: string;
  workspaceId: string;
}
const TeamLoaderBySlug = ({ slug, workspaceId }: Props) => {
  const {
    data: teamDetails,
    isLoading,
    isError,
    error,
  } = api.team.getTeamBySlug.useQuery({ slug, workspaceId });

  return (
    <div>
      <QueryStateHandler
        data={teamDetails}
        isLoading={isLoading}
        isError={isError}
        errorTitle="Error Loading Team Data"
        errorMessage={error?.message ?? "An unknown error occurred."}
      >
        {(teamDetails) => (
          <div>
            <PageHeader
              title={teamDetails.team.element.name}
              subtitle={teamDetails.team.element.description ?? ""}
              icon={<TeamAvatar team={teamDetails.team} size={SIZE.LARGE} />}
            />
            {teamDetails.access === TeamAccess.NO_ACCESS ? (
              <Centered>
                <InfoMessage
                  title="No Access"
                  message={`You don't have any access on this team.`}
                  imageUrl="/images/unauthorized.png"
                />
              </Centered>
            ) : (
              <div>Team Page HERE...</div>
            )}
          </div>
        )}
      </QueryStateHandler>
    </div>
  );
};

export default TeamLoaderBySlug;
