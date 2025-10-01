import z from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  teamAdminProcedure,
  workspaceReadProcedure,
} from "../trpc";
import { MembershipStatus } from "@prisma/client";
import { UserPrismaSelection } from "@/server/helper-functions/user";
import type { User } from "@/types/user";
import { addTeamMembersSchema } from "@/types/team";
import { TRPCError } from "@trpc/server";
import { unknownError } from "@/server/helper-functions";
import { TeamMembershipDetailsSelectedFields } from "@/server/helper-functions/prisma";
import { convertToTeamMemberProfile } from "@/server/helper-functions/team";

export const teamMembershipRouter = createTRPCRouter({
  searchNonMember: teamAdminProcedure
    .input(
      z.object({
        searchValue: z.string(),
        limit: z.number().min(1).max(100).optional().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const nonMembersData = await ctx.db.workspaceMembership.findMany({
        where: {
          workspaceId: input.workspaceId,
          status: MembershipStatus.Active,
          member: {
            OR: [
              {
                name: {
                  contains: input.searchValue,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: input.searchValue,
                  mode: "insensitive",
                },
              },
            ],
            teamMemberships: {
              none: {
                teamId: ctx.session.team.id,
              },
            },
          },
        },
        select: {
          member: {
            select: UserPrismaSelection,
          },
        },
        orderBy: {
          member: {
            name: "asc",
          },
        },
        distinct: ["memberId"],
      });

      const nonMembers = nonMembersData.map((user) => user.member);

      return nonMembers as User[];
    }),

  addTeamMembers: teamAdminProcedure
    .input(addTeamMembersSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const { userIdsToAdd } = input;
          const team = ctx.session.team;
          const userIdsOnly = userIdsToAdd.map((u) => u.userId);

          await tx.teamMembership.createMany({
            data: userIdsToAdd.map((data) => ({
              teamId: team.id,
              memberId: data.userId,
              role: data.role,
              status: "Active",
              addedById: ctx.session.user.id,
            })),
            skipDuplicates: true,
          });

          const createdTeamMembersData = await tx.teamMembership.findMany({
            where: { teamId: team.id, memberId: { in: userIdsOnly } },
            select: {
              ...TeamMembershipDetailsSelectedFields,
              member: {
                select: UserPrismaSelection,
              },
            },
          });

          const createdTeamMembers = createdTeamMembersData.map((membership) =>
            convertToTeamMemberProfile(membership),
          );

          return createdTeamMembers;
        });

        return results;
      } catch (error) {
        throw new TRPCError(unknownError(error as TRPCError));
      }
    }),
});
