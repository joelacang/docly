"use client";

import Badge from "@/components/custom/badge";
import ErrorMessage from "@/components/messages/error-message";
import KPICard from "@/features/dashboard/kpi-card";
import ElementDetail from "@/features/element/components/element-detail";
import ElementDetailsCard from "@/features/element/components/element-details-card";
import PageHeader from "@/features/pages/page-header";
import TeamAvatar from "@/features/teams/components/team-avatar";
import TeamLoaderBySlug from "@/features/teams/components/team-loader-by-slug";
import TeamPageHeader from "@/features/teams/components/team-page-header";
import { useMyTeams } from "@/providers/team-provider";
import { useMyWorkspaces } from "@/providers/workspace-provider";
import { SIZE } from "@/types";
import { Colors } from "@/utils/colors";
import { teamPrivacyIcon, teamTypeIcon } from "@/utils/icon";
import { Color } from "@prisma/client";
import { LockIcon, TagIcon, UserIcon } from "lucide-react";
import { useParams } from "next/navigation";

const TeamHomePage = () => {
  const { teamSlug } = useParams();
  const { currentTeam } = useMyTeams();
  const { currentWorkspace } = useMyWorkspaces();
  const color = Colors[currentTeam?.team.element.color ?? "BLUE"];

  if (!teamSlug || !currentWorkspace) {
    return (
      <div>
        <ErrorMessage message="Missing Information." />
      </div>
    );
  }
  if (!currentTeam || currentTeam.team.element.slug !== teamSlug) {
    return (
      <div>
        <TeamLoaderBySlug
          slug={teamSlug.toString()}
          workspaceId={currentWorkspace.workspace.id}
        />
      </div>
    );
  }

  return (
    <div>
      <TeamPageHeader
        team={currentTeam.team}
        membershipInfo={currentTeam.membership}
      />
      <div className="@container w-full px-4">
        <div className="grid w-full grid-cols-12 gap-6">
          <div className="col-span-12 h-full border @6xl:col-span-8">
            Main Content
          </div>
          <div className="col-span-12 @6xl:col-span-4">
            <ElementDetailsCard element={currentTeam.team.element}>
              <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2">
                <ElementDetail
                  title="Team Type"
                  icon={TagIcon}
                  color={color.primary}
                >
                  <Badge display={teamTypeIcon[currentTeam.team.type]}>
                    {currentTeam.team.type}
                  </Badge>
                </ElementDetail>
                <ElementDetail
                  title="Team Privacy"
                  icon={LockIcon}
                  color={color.primary}
                >
                  <Badge display={teamPrivacyIcon[currentTeam.team.privacy]}>
                    {currentTeam.team.privacy}
                  </Badge>
                </ElementDetail>
              </div>
            </ElementDetailsCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamHomePage;
