import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  // Example: attach user or other request-scoped data here
  const user = { name: req.headers['username'] ?? 'anonymous' };
  return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;