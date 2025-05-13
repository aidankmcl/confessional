import { initTRPC } from '@trpc/server';

import { gameRouter } from "./routes/game";


export const t = initTRPC.create();

export const appRouter = t.mergeRouters(gameRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
