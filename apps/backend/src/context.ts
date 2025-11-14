import { initTRPC } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? 'anonymous' };
  return { req, res, user };
}

type Context = Awaited<ReturnType<typeof createContext>>;

export const rootTrpc = initTRPC.context<Context>().create();