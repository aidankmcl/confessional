import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { rootTrpc } from '../context';

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

export const gameRouter = rootTrpc.router({
  getGameById: rootTrpc.procedure.input(z.string()).query((opts) => {
    if (!Object.keys(state).length) throw new TRPCError({
      code: "NOT_FOUND",
      message: 'Found no active game',
    });

    return state;
  }),
  getPlayers: rootTrpc.procedure
    .query(() => {
      return state.npcPlayers;
    }),
  createGame: rootTrpc.procedure
    .input(z.object({ player: z.string(), npcPlayers: z.array(z.string()) }))
    .mutation((opts) => {
      const id = Date.now().toString();
      const gameState: GameState = { id, player: opts.input.player, npcPlayers: opts.input.npcPlayers };

      return gameState;
    }),
});
