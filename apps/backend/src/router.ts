import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

type User = {
  id: string;
  name: string;
  bio?: string;
};

const users: Record<string, User> = {};
export const t = initTRPC.create();

export const appRouter = t.router({
  ping: t.procedure.output(z.string()).query((opts) => {
    return "pong"
  }),
  getUserById: t.procedure.input(z.string()).query((opts) => {
    const user = users[opts.input];
    if (!user) throw new TRPCError({
      code: "NOT_FOUND",
      message: 'Found no User with that ID',
    });

    return user
  }),
  createUser: t.procedure
    .input(
      z.object({
        name: z.string().min(3),
        bio: z.string().max(142).optional(),
      }),
    )
    .mutation((opts) => {
      const id = Date.now().toString();
      const user: User = { id, ...opts.input };
      users[user.id] = user;
      return user;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
