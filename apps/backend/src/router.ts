
import { rootTrpc } from './context';

import { gameRouter } from "./routes/game";
import { adminRouter } from './routes/admin';

export const appRouter = rootTrpc.mergeRouters(gameRouter, adminRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
