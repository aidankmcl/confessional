import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.create();

export const adminRouter = t.router({
  ping: t.procedure.output(z.string()).query((opts) => {
    return "pong"
  }),
  health: t.procedure.output(z.string()).query((opts) => {
    return "ok"
  })
});
