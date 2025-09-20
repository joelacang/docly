import {
  createElement,
  ElementPreviewPrismaSelection,
} from "@/server/helper-functions/element";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { WorkspaceMembership, WorkspacePreview } from "@/types/workspace";
import {
  ElementAccess,
  ElementStatus,
  ElementType,
  WorkspaceMembershipRole,
  WorkspaceMembershipStatus,
} from "@prisma/client";
import { createElementSchema } from "@/types/element";
import { createWorkspace } from "@/server/helper-functions/workspace";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const workspaceRouter = createTRPCRouter({
  //Mutations
  create: protectedProcedure
    .input(createElementSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const element = await createElement({
            data: input,
            transaction: tx,
            loggedUserId: ctx.session.user.id,
          });

          const workspace = await createWorkspace({
            elementId: element.id,
            loggedUserId: ctx.session.user.id,
            transaction: tx,
          });

          return workspace;
        });

        return results;
      } catch (error) {
        console.error(`Error Creating ${input.type}: `, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create ${input.type}. An unknown error occurred.`,
          cause: error,
        });
      }
    }),

  // Queries
  getMyWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.workspaceMembership.findMany({
      where: {
        status: WorkspaceMembershipStatus.Active,
        role: {
          notIn: [WorkspaceMembershipRole.Guest],
        },
        memberId: ctx.session.user.id,
        workspace: {
          element: {
            status: ElementStatus.Active,
          },
        },
      },
      select: {
        id: true,
        role: true,
        status: true,
        workspace: {
          select: {
            id: true,
            element: {
              select: ElementPreviewPrismaSelection,
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const myWorkspaces: WorkspaceMembership[] = data.map((d) => ({
      workspace: {
        id: d.workspace.id,
        element: d.workspace.element,
      },
      membership: {
        id: d.id,
        role: d.role,
        status: d.status,
      },
    }));

    return myWorkspaces;
  }),

  searchToJoin: protectedProcedure
    .input(z.object({ searchValue: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.workspace.findMany({
        where: {
          element: {
            name: {
              contains: input.searchValue,
              mode: "insensitive",
            },
            type: ElementType.Workspace,
            access: ElementAccess.Private,
            status: ElementStatus.Active,
          },
          NOT: {
            members: {
              some: {
                memberId: ctx.session.user.id,
              },
            },
          },
        },
        select: {
          id: true,
          element: {
            select: ElementPreviewPrismaSelection,
          },
        },
      });

      const workspaces: WorkspacePreview[] = data.map((w) => {
        return {
          id: w.id,
          element: w.element,
        };
      });

      return workspaces;
    }),
});
