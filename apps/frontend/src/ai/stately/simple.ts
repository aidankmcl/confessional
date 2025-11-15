import { createExpert, fromDecision } from '@statelyai/agent';
import { z } from 'zod';
import { setup, createActor, createMachine } from 'xstate';
import { openai } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';


const lmstudio = createOpenAICompatible({
    name: 'lmstudio',
    baseURL: 'http://localhost:1234/v1'
});

const model = lmstudio('qwen/qwen3-4b-2507');

const expert = createExpert({
  id: 'simple',
  model,
  events: {
    'expert.thought': z.object({
      text: z.string().describe('The text of the thought'),
    }),
  },
});

const machine = createMachine({
  initial: 'thinking',
  states: {
    thinking: {
      on: {
        'expert.thought': {
          actions: ({ event }) => console.log(event.text),
          target: 'thought',
        },
      },
    },
    thought: {
      type: 'final',
    },
  },
});

const actor = createActor(machine).start();

expert.onMessage(console.log);

expert.interact(actor, (obs: any) => {
  if (obs.state.matches('thinking')) {
    return {
      goal: 'Think about a random topic, and then share that thought.',
    };
  }
});