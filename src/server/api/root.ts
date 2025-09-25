import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { workspaceRouter } from "./routers/workspace";
import { elementRouter } from "./routers/element";
import { membershipRouter } from "./routers/membership";
import { folderRouter } from "./routers/folder";
import { collectionRouter } from "./routers/collection";
import { favoriteRouter } from "./routers/favorite";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  workspace: workspaceRouter,
  element: elementRouter,
  membership: membershipRouter,
  folder: folderRouter,
  collection: collectionRouter,
  favorite: favoriteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
