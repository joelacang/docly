import {
  createTeamSchema,
  type MyTeamMembership,
  type TeamMembers,
} from "@/types/team";
import {
  createTRPCRouter,
  workspaceAdminProcedure,
  workspaceReadProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { unknownError } from "@/server/helper-functions";
import { createElement } from "@/server/helper-functions/element";
import {
  MyTeamMembershipSelectedFields,
  TeamMemberProfileSelectedFields,
  TeamSummarySelectedFields,
} from "@/server/helper-functions/prisma";
import {
  convertToMyTeamMembership,
  convertToTeamMemberProfile,
  convertToTeamSummary,
} from "@/server/helper-functions/team";
import { MembershipStatus, TeamRole } from "@prisma/client";

export const teamRouter = createTRPCRouter({
  create: workspaceAdminProcedure
    .input(createTeamSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const {
            type,
            privacy,
            workspaceId,
            leaderIds,
            memberIds,
            officerIds,
            ...otherFields
          } = input;

          const element = await createElement({
            data: otherFields,
            transaction: tx,
            loggedUserId: ctx.session.user.id,
          });

          const createdTeam = await tx.team.create({
            data: {
              elementId: element.id,
              workspaceId,
              type,
              privacy,
            },
            select: { id: true },
          });

          if (leaderIds.length > 0) {
            await tx.teamMembership.createMany({
              data: leaderIds.map((id) => ({
                teamId: createdTeam.id,
                memberId: id,
                role: TeamRole.Leader,
                status: MembershipStatus.Active,
              })),
            });
          }

          if (officerIds.length > 0) {
            await tx.teamMembership.createMany({
              data: officerIds.map((id) => ({
                teamId: createdTeam.id,
                memberId: id,
                role: TeamRole.Officer,
                status: MembershipStatus.Active,
              })),
            });
          }

          if (memberIds.length > 0) {
            await tx.teamMembership.createMany({
              data: memberIds.map((id) => ({
                teamId: createdTeam.id,
                memberId: id,
                role: TeamRole.Member,
                status: MembershipStatus.Active,
              })),
            });
          }

          const teamData = await tx.team.findUnique({
            where: { id: createdTeam.id },
            select: {
              ...TeamSummarySelectedFields,
              members: {
                where: {
                  role: TeamRole.Leader,
                  status: MembershipStatus.Active,
                },
                select: TeamMemberProfileSelectedFields,
              },
            },
          });

          if (!teamData)
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message: "Team Not Found",
            });

          const { members, ...teamDetails } = teamData;

          const teamSummary = convertToTeamSummary(teamDetails);

          const memberProfiles = members.map((m) =>
            convertToTeamMemberProfile(m),
          );

          return {
            team: teamSummary,
            members: memberProfiles,
          } as TeamMembers;
        });

        return results;
      } catch (error) {
        console.error(`Error creating team:`, error);
        throw new TRPCError(unknownError(error as TRPCError));
      }
    }),

  getTeams: workspaceReadProcedure.query(async ({ ctx, input }) => {
    const teamsData = await ctx.db.team.findMany({
      where: {
        workspaceId: input.workspaceId,
        element: {
          status: "Active",
        },
      },
      select: {
        ...TeamSummarySelectedFields,
        members: {
          where: {
            status: MembershipStatus.Active,
          },
          select: TeamMemberProfileSelectedFields,
        },
      },
    });

    const teams: TeamMembers[] = teamsData.map((team) => {
      const { members, ...teamFields } = team;

      const summary = convertToTeamSummary(teamFields);
      const profiles = members.map((m) => convertToTeamMemberProfile(m));

      return { team: summary, members: profiles } as TeamMembers;
    });

    return teams;
  }),

  getMyTeams: workspaceReadProcedure.query(async ({ ctx, input }) => {
    const teamsData = await ctx.db.teamMembership.findMany({
      where: {
        memberId: ctx.session.user.id,
        status: "Active",
        team: {
          element: {
            status: "Active",
          },
          workspaceId: input.workspaceId,
        },
      },
      select: MyTeamMembershipSelectedFields,
      orderBy: {
        team: {
          element: {
            name: "asc",
          },
        },
      },
    });

    const myTeams: MyTeamMembership[] = teamsData.map((t) => {
      return convertToMyTeamMembership(t);
    });

    return myTeams;
  }),
});
