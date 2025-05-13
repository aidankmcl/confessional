import Fastify from "fastify";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

import { createContext } from './context';
import { appRouter, type AppRouter } from './router';


async function buildServer() {
  const fastify = Fastify()
    .withTypeProvider<ZodTypeProvider>()
    .setValidatorCompiler(validatorCompiler)
    .setSerializerCompiler(serializerCompiler);

  // // Register @fastify/websocket for tRPC WebSocket support
  // await fastify.register(require("@fastify/websocket"));

  fastify.register(fastifyTRPCPlugin, {
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  });

  return fastify;
}

async function start() {
  const server = await buildServer();

  server.register(require("@fastify/cors"), {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server listening on http://0.0.0.0:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

export { buildServer, AppRouter };
