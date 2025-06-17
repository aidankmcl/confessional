// nodes.ts
import { GameState } from "./state";
import { AGENTS, AgentMeta } from "./actors";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

/**
 * Orchestrator: decides whose turn is next
 */
export function orchestrator(state: GameState, _config?: unknown): Partial<GameState> {
  const order = ["human", ...AGENTS.map((a) => a.key)];
  if (!state.lastActor) {
    // start with the human
    return { nextActor: "human" };
  }
  const idx = (order.indexOf(state.lastActor) + 1) % order.length;
  return { nextActor: order[idx] };
}

/**
 * Human turn node.
 * Assumes external UI has injected a HumanMessage into state.messages before this runs.
 */
export function humanTurn(state: GameState, _config?: unknown): Partial<GameState> {
  return {};
}

/**
 * Factory to create nodes for each AI agent
 */
export function makeAgentNode(meta: AgentMeta) {
  return (state: GameState, _config?: unknown): Partial<GameState> => {
    // Stub: replace with real LLM call using state.messages + meta.persona + meta.backstory
    const content = `${meta.name} says: \u201cI suspect someone\u2026\u201d`;
    const msg = new AIMessage(content, { agent: meta.key });
    return {
      messages: [...state.messages, msg],
      lastActor: meta.key,
    };
  };
}
