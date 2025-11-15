import { createExpert, fromDecision } from '@statelyai/agent';
import { assign, createActor, log, setup } from 'xstate';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
// import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

import { fromTerminal } from './utils/helpers';

const lmstudio = createOpenAICompatible({
    name: 'lmstudio',
    baseURL: 'http://localhost:1234/v1'
});

const model = lmstudio('qwen/qwen3-4b-2507');

const expert = createExpert({
  id: 'multi',
  model,
  events: {
    'expert.respond': z.object({
      response: z.string().describe('The response from the expert'),
    }),
  },
});


type CtxState = {
  topic: string | null;
  discourse: string[];
};

const machine = setup({
  types: {
    context: {} as CtxState,
  },
  actors: {
    getFromTerminal: fromTerminal,
    expert: fromDecision(expert),
  },
}).createMachine({
  initial: 'asking',
  context: {
    topic: null,
    discourse: [],
  },
  states: {
    asking: {
      invoke: {
        src: 'getFromTerminal',
        input: 'What is the question?',
        onDone: {
          actions: assign({
            topic: ({ event }) => event.output,
          }),
          target: 'positiveResponse',
        },
      },
    },
    positiveResponse: {
      invoke: {
        src: 'expert',
        input: ({ context }: { context: CtxState }) => ({
          context,
          goal: 'Debate the topic, and take the positive position. Respond directly to the last message of the discourse. Keep it short.',
        }),
      },
      on: {
        'expert.respond': {
          actions: [
            assign({
              discourse: ({ context, event }) =>
                context.discourse.concat(event.response),
            }),
            log(({ event }) => event.response),
          ],
          target: 'negativeResponse',
        },
      },
    },
    negativeResponse: {
      invoke: {
        src: 'expert',
        input: ({ context }: { context: CtxState }) => ({
          model,
          context,
          goal: 'Debate the topic, and take the negative position. Respond directly to the last message of the discourse. Keep it short.',
        }),
      },
      on: {
        'expert.respond': {
          actions: [
            assign({
              discourse: ({ context, event }) =>
                context.discourse.concat(event.response),
            }),
            log(({ event }) => event.response),
          ],
          target: 'positiveResponse',
        },
      },
      always: {
        guard: ({ context }) => context.discourse.length >= 5,
        target: 'debateOver',
      },
    },
    debateOver: {
      type: 'final',
    },
  },
  exit: () => {
    process.exit();
  },
});

createActor(machine).start();

// const actor = createActor(machine);
// expert.interact(actor);
// actor.start();
