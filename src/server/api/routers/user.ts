import type { User } from "@/types/user";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getLoggedUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) return null;

    const { user } = ctx.session;

    const roleData = await ctx.db.user.findUnique({
      where: { id: user.id },
      select: {
        role: true,
      },
    });

    if (!roleData) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: roleData.role,
    } satisfies User;
  }),
});
