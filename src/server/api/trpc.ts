/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError, type TRPC_ERROR_CODE_KEY } from "@trpc/server";
import superjson from "superjson";
import z, { ZodError } from "zod";

import { db } from "@/server/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Z } from "node_modules/better-auth/dist/shared/better-auth.B2AIpsP8";
import {
  getWorkspaceMembership,
  isWorkspaceItemAccessible,
} from "../helper-functions/workspace";
import { getWorkspaceAccess } from "@/utils";
import { Access } from "@/types/workspace";
import { unAuthorized } from "../helper-functions";
import { Input } from "@/components/ui/input";
import { MembershipStatus } from "@prisma/client";
import {
  MyTeamMembershipSelectedFields,
  TeamMembershipDetailsSelectedFields,
  TeamSummarySelectedFields,
} from "../helper-functions/prisma";
import {
  convertToMyTeamMembership,
  convertToTeamMembershipDetails,
  convertToTeamSummary,
  isTeamItemAccessible,
} from "../helper-functions/team";
import { getTeamAccess, TeamAccess } from "@/types/team";
import { unauthorized } from "next/navigation";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return {
    db,
    session,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError(
      unAuthorized("You must be logged in to access this resource."),
    );
  }

  const user = await ctx.db.user.findUnique({
    where: { id: ctx.session.user.id },
    select: {
      role: true,
    },
  });

  if (!user) {
    throw new TRPCError(
      unAuthorized("You must be logged in to access this resource"),
    );
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          role: user.role,
        },
      },
    },
  });
});

export const workspaceReadProcedure = protectedProcedure
  .input(z.object({ workspaceId: z.cuid() }))
  .use(async ({ ctx, input, next }) => {
    const details = await getWorkspaceMembership({
      workspaceId: input.workspaceId,
      userId: ctx.session.user.id,
    });

    if (!details)
      throw new TRPCError(unAuthorized("No Workspace Membership found."));

    if (details.access === Access.NO_ACCESS)
      throw new TRPCError(
        unAuthorized("You don't have any access to this workspace"),
      );

    const isAccessible = details.access
      ? isWorkspaceItemAccessible(
          details.workspace.element.status,
          details.access,
        )
      : false;

    if (!isAccessible)
      throw new TRPCError(
        unAuthorized(
          `This workspace is not accessible. It may be restricted, deleted, or your role is insufficient. `,
        ),
      );

    const workspaceAccess = getWorkspaceAccess(details);

    return next({
      ctx: {
        ...ctx,
        session: {
          ...ctx.session,
          workspaceMembership: details,
          access: workspaceAccess,
        },
      },
    });
  });

export const workspaceEditProcedure = workspaceReadProcedure.use(
  ({ ctx, next }) => {
    const access = ctx.session.access;

    const canEdit = access > Access.READ_ONLY;

    if (!canEdit)
      throw new TRPCError(
        unAuthorized("You don't have edit access on this workspace."),
      );

    return next({
      ctx,
    });
  },
);

export const workspaceAdminProcedure = workspaceReadProcedure.use(
  ({ ctx, next }) => {
    const access = ctx.session.access;

    const isAdmin = access >= Access.ADMIN;

    if (!isAdmin)
      throw new TRPCError(
        unAuthorized("You don't have admin access on this workspace."),
      );

    return next({
      ctx,
    });
  },
);

export const teamReadProcedure = workspaceReadProcedure
  .input(z.object({ teamId: z.cuid() }))
  .use(async ({ ctx, input, next }) => {
    const teamData = await ctx.db.team.findUnique({
      where: { id: input.teamId },
      select: {
        ...TeamSummarySelectedFields,
      },
    });

    if (!teamData)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No Team Found.",
      });

    const team = convertToTeamSummary(teamData);

    const teamMembershipData = await ctx.db.teamMembership.findFirst({
      where: {
        teamId: team.id,
        team: {
          workspaceId: ctx.session.workspaceMembership.workspace.id,
        },
        memberId: ctx.session.user.id,
        status: MembershipStatus.Active,
      },
      select: {
        ...TeamMembershipDetailsSelectedFields,
      },
    });

    const teamAccess = getTeamAccess(
      teamMembershipData?.role,
      ctx.session.workspaceMembership.membership?.role,
    );

    if (teamAccess === TeamAccess.NO_ACCESS) {
      throw new TRPCError(
        unAuthorized("You don't have any access to this team."),
      );
    }
    // Check if the team item is isAccessible.
    const workspaceAccess = ctx.session.workspaceMembership.access;

    const isAccessible =
      teamMembershipData && workspaceAccess
        ? isTeamItemAccessible(team.element.status, teamAccess, workspaceAccess)
        : false;

    if (!isAccessible)
      throw new TRPCError(
        unAuthorized(
          "This team is not accessible. It may be restricted, deleted, or your role is insufficient.",
        ),
      );

    const teamMembership = teamMembershipData
      ? convertToTeamMembershipDetails(teamMembershipData)
      : null;

    return next({
      ctx: {
        ...ctx,
        session: {
          ...ctx.session,
          team: {
            ...team,
            membership: teamMembership,
            access: teamAccess,
          },
        },
      },
    });
  });

export const teamAdminProcedure = teamReadProcedure.use(
  async ({ ctx, next }) => {
    const workspaceAccess = ctx.session.workspaceMembership.access;
    const isWorkspaceAdmin = workspaceAccess && workspaceAccess >= Access.ADMIN;

    const teamAccess = ctx.session.team.access;
    const isTeamAdmin = teamAccess >= TeamAccess.ADMIN;

    if (!isTeamAdmin && !isWorkspaceAdmin) {
      throw new TRPCError(
        unAuthorized("You don't have admin access on this team."),
      );
    }

    return next({ ctx });
  },
);

export const teamLeaderProcedure = teamReadProcedure.use(
  async ({ ctx, next }) => {
    const workspaceAccess = ctx.session.workspaceMembership.access;
    const isWorkspaceAdmin = workspaceAccess && workspaceAccess >= Access.ADMIN;

    const teamAccess = ctx.session.team.access;
    const isTeamLeader = teamAccess === TeamAccess.LEADER;

    if (!isTeamLeader && !isWorkspaceAdmin) {
      throw new TRPCError(
        unAuthorized("You don't have leader access on this team."),
      );
    }

    return next({ ctx });
  },
);
