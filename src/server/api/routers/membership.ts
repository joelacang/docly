import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  workspaceReadProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  MemberPreviewSelection,
  WorkspacePreviewSelection,
} from "@/server/helper-functions/prisma";
import { MembershipRole, MembershipStatus } from "@prisma/client";
import { unknownError } from "@/server/helper-functions";
import type { MemberPreview } from "@/types/member";
import { UserPrismaSelection } from "@/server/helper-functions/user";
import type { User } from "@/types/user";

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
          const member = await tx.workspaceMembership.create({
            data: {
              workspaceId: input.workspaceId,
              memberId: ctx.session.user.id,
              role: MembershipRole.Member,
              status: MembershipStatus.Active,
              joinDate: new Date(),
            },
            select: {
              ...MemberPreviewSelection,
              workspace: {
                select: WorkspacePreviewSelection,
              },
            },
          });

          return member;
        });

        return results;
      } catch (error) {
        console.error(`Error joining workspace: `, error);
        throw new TRPCError(unknownError(error as TRPCError));
      }
    }),

  getMembers: workspaceReadProcedure.query(async ({ ctx, input }) => {
    const members = await ctx.db.workspaceMembership.findMany({
      where: {
        status: MembershipStatus.Active,
        workspaceId: input.workspaceId,
      },
      select: MemberPreviewSelection,
    });

    return members satisfies MemberPreview[];
  }),

  searchMember: workspaceReadProcedure
    .input(
      z.object({
        searchValue: z.string(),
        teamId: z.cuid().optional(),
        limit: z.number().min(1).max(100).optional().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const membersData = await ctx.db.workspaceMembership.findMany({
        where: {
          member: {
            name: {
              contains: input.searchValue,
              mode: "insensitive",
            },
          },
          workspaceId: input.workspaceId,
          status: "Active",
        },
        select: {
          member: {
            select: UserPrismaSelection,
          },
        },
        take: input.limit,
        orderBy: {
          member: {
            name: "asc",
          },
        },
      });

      const members = membersData.map((m) => m.member);

      return members as User[];
    }),
});
