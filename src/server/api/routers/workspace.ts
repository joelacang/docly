import { createElement } from "@/server/helper-functions/element";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  createWorkspaceSchema,
  type WorkspaceMembership,
  type WorkspacePreview,
} from "@/types/workspace";
import {
  ElementStatus,
  ElementType,
  MembershipRole,
  MembershipStatus,
  WorkspaceType,
} from "@prisma/client";
import {
  convertToWorkspaceMembership,
  createWorkspace,
} from "@/server/helper-functions/workspace";
import { TRPCError } from "@trpc/server";
import z from "zod";
import {
  ElementPreviewPrismaSelection,
  WorkspaceMembershipPrismaSelection,
} from "@/server/helper-functions/prisma";
import { getWorkspaceAccess } from "@/utils";

export const workspaceRouter = createTRPCRouter({
  //Mutations
  create: protectedProcedure
    .input(createWorkspaceSchema)
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
            workspaceType: input.type,
          });

          return workspace;
        });

        return results;
      } catch (error) {
        console.error(`Error Creating ${input.elementType}: `, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create ${input.elementType}. An unknown error occurred.`,
          cause: error,
        });
      }
    }),

  // Queries
  getMyWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.workspaceMembership.findMany({
      where: {
        status: MembershipStatus.Active,
        role: {
          notIn: [MembershipRole.Guest],
        },
        memberId: ctx.session.user.id,
        workspace: {
          element: {
            status: ElementStatus.Active,
          },
        },
      },
      select: WorkspaceMembershipPrismaSelection,
      orderBy: {
        createdAt: "asc",
      },
    });

    const myWorkspaces: WorkspaceMembership[] = data.map((w) => {
      const membershipData = convertToWorkspaceMembership(w);

      return { ...membershipData, access: getWorkspaceAccess(membershipData) };
    });

    const pref = await ctx.db.userPreference.findUnique({
      where: { userId: ctx.session.user.id },
      select: {
        lastVisitedWorkspace: true,
      },
    });

    return {
      myWorkspaces,
      lastWorkspaceVisited: pref?.lastVisitedWorkspace ?? null,
    };
  }),

  getWorkspaceBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.workspaceMembership.findFirst({
        where: {
          workspace: {
            element: {
              slug: input.slug,
            },
          },
        },
        select: WorkspaceMembershipPrismaSelection,
      });

      if (!data) return null;

      const membership = convertToWorkspaceMembership(data);

      return {
        ...membership,
        access: getWorkspaceAccess(membership),
      } satisfies WorkspaceMembership;
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
            status: ElementStatus.Active,
          },
          type: WorkspaceType.Private,
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
          type: true,
          element: {
            select: ElementPreviewPrismaSelection,
          },
        },
      });

      const workspaces: WorkspacePreview[] = data.map((w) => {
        return {
          id: w.id,
          type: w.type,
          element: w.element,
        };
      });

      return workspaces;
    }),
});
