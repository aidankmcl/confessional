
import { z } from 'zod';

import { rootTrpc } from '../context';

export const adminRouter = rootTrpc.router({
  ping: rootTrpc.procedure.output(z.string()).query((opts) => {
    return "pong"
  }),
  health: rootTrpc.procedure.output(z.string()).query((opts) => {
    return "ok"
  })
});
