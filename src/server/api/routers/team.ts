import { createTeamSchema, type TeamPreview } from "@/types/team";
import {
  createTRPCRouter,
  workspaceAdminProcedure,
  workspaceReadProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { unknownError } from "@/server/helper-functions";
import { createElement } from "@/server/helper-functions/element";
import {
  ElementPreviewPrismaSelection,
  TeamPreviewBaseSelection,
  TeamPreviewSelection,
} from "@/server/helper-functions/prisma";
import { ElementStatus } from "@prisma/client";
import { convertToTeamPreview } from "@/server/helper-functions/team";

export const teamRouter = createTRPCRouter({
  create: workspaceAdminProcedure
    .input(createTeamSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const { type, privacy, workspaceId, leaderIds, ...otherFields } =
            input;

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
            select: TeamPreviewBaseSelection,
          });

          if (leaderIds.length > 0) {
            await tx.teamMembership.createMany({
              data: leaderIds.map((id) => ({
                teamId: createdTeam.id,
                memberId: id,
                role: "Leader",
                status: "Active",
              })),
            });
          }

          return convertToTeamPreview({ ...createdTeam, element });
        });

        return results;
      } catch (error) {
        console.error(`Error creating team:`, error);
        throw new TRPCError(unknownError(error as Error));
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
        ...TeamPreviewSelection,
        element: {
          select: ElementPreviewPrismaSelection,
        },
      },
    });

    const teams: TeamPreview[] = teamsData.map((t) => {
      return convertToTeamPreview(t);
    });

    return teams;
  }),
});
