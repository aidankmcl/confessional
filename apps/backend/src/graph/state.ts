// state.ts
import { BaseMessage } from "@langchain/core/messages";

export interface GameState {
  /** Conversation history */
  messages: BaseMessage[];

  /** Running list of suspects */
  currentSuspects: string[];

  /** Whose turn is next: "human" or an agent key */
  nextActor: string;

  /** Who just spoke last */
  lastActor?: string;
}

// Define the shape of the state for channels.
// Using 'null' tells LangGraph to use the default "last value" semantics
// and infer types from GameState.
export const gameStateChannels = {
  channels: {
    messages: null,
    currentSuspects: null,
    nextActor: null,
    lastActor: null, // Handles optionality correctly
  }
};