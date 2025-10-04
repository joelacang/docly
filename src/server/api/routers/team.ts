import {
  createTeamSchema,
  getTeamAccess,
  TeamAccess,
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
import z from "zod";

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

  getMyTeams: workspaceReadProcedure.query(async ({ ctx }) => {
    const teamsData = await ctx.db.teamMembership.findMany({
      where: {
        memberId: ctx.session.user.id,
        status: "Active",
        team: {
          element: {
            status: "Active",
          },
          workspaceId: ctx.session.workspaceMembership.workspace.id,
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

    const membershipRecord = await ctx.db.workspaceMembership.findFirst({
      where: {
        workspaceId: ctx.session.workspaceMembership.workspace.id,
        memberId: ctx.session.user.id,
      },
      select: {
        id: true,
        lastTeamSelectedId: true,
      },
    });

    const lastTeamSelected =
      myTeams.find((t) => t.team.id === membershipRecord?.lastTeamSelectedId) ??
      myTeams[0] ??
      null;

    // ✅ If there's no stored ID, and we have at least one team, update the record
    if (!membershipRecord?.lastTeamSelectedId && lastTeamSelected) {
      await ctx.db.workspaceMembership.update({
        where: { id: membershipRecord!.id },
        data: {
          lastTeamSelectedId: lastTeamSelected.team.id,
        },
      });
    }

    return { myTeams, lastTeamSelected };
  }),

  getTeamBySlug: workspaceReadProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const teamData = await ctx.db.team.findFirst({
        where: { element: { slug: input.slug } },
        select: {
          ...TeamSummarySelectedFields,
          members: {
            where: {
              memberId: ctx.session.user.id,
            },
            select: TeamMemberProfileSelectedFields,
          },
        },
      });

      if (!teamData)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team Data not Found.",
        });
      const { members, ...summary } = teamData;

      const team = convertToTeamSummary(summary);
      const membershipInfo = members.map((m) =>
        convertToTeamMemberProfile(m),
      )[0];
      const workspaceRole = ctx.session.workspaceMembership.membership?.role;

      const teamAccess =
        membershipInfo && workspaceRole
          ? getTeamAccess(membershipInfo.membership.role, workspaceRole)
          : TeamAccess.NO_ACCESS;

      return {
        team,
        memberInfo: membershipInfo ?? null,
        access: teamAccess,
      };
    }),

  setLastTeamSelected: workspaceReadProcedure
    .input(z.object({ teamId: z.cuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.workspaceMembership.membership)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membership not found. ",
        });

      const updatedMembership = await ctx.db.workspaceMembership.update({
        where: { id: ctx.session.workspaceMembership.membership.id },
        data: {
          lastTeamSelectedId: input.teamId,
        },
        select: {
          id: true,
        },
      });

      return { success: true, updatedMembership };
    }),
});
