import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { WorkspaceMembership } from "@/types/workspace";
import { WorkspaceMembershipPrismaSelection } from "@/server/helper-functions/prisma";
import { MembershipRole, MembershipStatus } from "@prisma/client";

export const membershipRouter = createTRPCRouter({
  join: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const existingMembership = await tx.workspaceMembership.findFirst({
            where: {
              workspaceId: input.workspaceId,
              memberId: ctx.session.user.id,
            },
            select: {
              role: true,
              status: true,
              workspace: {
                select: {
                  element: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          });

          if (existingMembership)
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message: `You have existing membership in '${existingMembership.workspace.element.name}' with the role: '${existingMembership.role}' and status: '${existingMembership.status}'`,
            });

          //Auto join first. Require approval to do later.
          const m = await tx.workspaceMembership.create({
            data: {
              workspaceId: input.workspaceId,
              memberId: ctx.session.user.id,
              role: MembershipRole.Member,
              status: MembershipStatus.Active,
            },
            select: WorkspaceMembershipPrismaSelection,
          });

          const membership: WorkspaceMembership = {
            workspace: {
              id: m.workspace.id,
              element: m.workspace.element,
              type: m.workspace.type,
            },
            membership: {
              id: m.id,
              role: m.role,
              status: m.status,
            },
          };

          //Add Notification later.

          return membership;
        });

        return results;
      } catch (error) {
        console.error(`Error joining workspace: `, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error joining workspace. An unknown error occurred.`,
          cause: error,
        });
      }
    }),
});
