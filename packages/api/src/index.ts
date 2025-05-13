import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Initialize tRPC
const t = initTRPC.create();

// Context type (expand as needed)
export type Context = {};

// Export helpers for router and procedures
export const publicProcedure = t.procedure;

// Example input schema
export const exampleInputSchema = z.object({
  text: z.string().min(1),
});

// Example router with subscription
export const appRouter = t.router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'world'}!`,
      };
    }),
  randomNumber: t.procedure.subscription(async function* () {
    while (true) {
      yield { randomNumber: Math.random() };
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }),
});

// Export AppRouter type for frontend use
export type AppRouter = typeof appRouter;
