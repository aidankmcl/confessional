import { initTRPC } from '@trpc/server';

import { gameRouter } from "./routes/game";
import { adminRouter } from './routes/admin';

export const t = initTRPC.create();

export const appRouter = t.mergeRouters(gameRouter, adminRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
