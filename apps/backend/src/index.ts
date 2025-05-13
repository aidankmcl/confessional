import Fastify from "fastify";
import z from "zod";
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

// import { setupTRPC } from "./trpc";

async function buildServer() {
  const fastify = Fastify()
    .withTypeProvider<ZodTypeProvider>()
    .setValidatorCompiler(validatorCompiler)
    .setSerializerCompiler(serializerCompiler);

  // // Register @fastify/websocket for tRPC WebSocket support
  // await fastify.register(require("@fastify/websocket"));

  fastify.get(
    "/ping",
    {
      schema: {
        response: { 200: z.object({ pong: z.string() }) },
      },
    },
    async (request, reply) => {
      return { pong: "ok" };
    },
  );

  // Register tRPC plugin
  // setupTRPC(fastify);

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

export { buildServer };
