import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

type GameState = {
  id: string;
  player: string;
  npcPlayers: string[];
};

const state: GameState = {
  id: (new Date()).getTime().toString(),
  player: "Aidan",
  npcPlayers: ["Becca", "Carl", "Denim"]
};
export const t = initTRPC.create();

export const gameRouter = t.router({
  getGameById: t.procedure.input(z.string()).query((opts) => {
    if (!Object.keys(state).length) throw new TRPCError({
      code: "NOT_FOUND",
      message: 'Found no active game',
    });

    return state;
  }),
  getPlayers: t.procedure
    .query(() => {
      return state.npcPlayers;
    }),
  createGame: t.procedure
    .input(z.object({ player: z.string(), npcPlayers: z.array(z.string()) }))
    .mutation((opts) => {
      const id = Date.now().toString();
      const gameState: GameState = { id, player: opts.input.player, npcPlayers: opts.input.npcPlayers };

      return gameState;
    }),
});
