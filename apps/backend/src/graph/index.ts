// graph.ts
import { StateGraph, END } from "@langchain/langgraph";
import { GameState, gameStateChannels } from "./state";
import { AGENTS } from "./actors";
import { orchestrator, humanTurn, makeAgentNode } from "./nodes";
import { writeFileSync } from "node:fs";

export function buildGameGraph(): StateGraph<GameState> {
  const game = new StateGraph<GameState, GameState>(gameStateChannels);

  // 1. Register nodes
  // __start__ node: immediately transitions to orchestrator
  game.addNode("__start__", (state: GameState) => ({}));
  game.addNode("orchestrator", orchestrator);
  game.addNode("human", humanTurn);
  for (const agent of AGENTS) {
    game.addNode(agent.key, makeAgentNode(agent));
  }

  // 2. Wire up transitions
  // Map actor keys to node names
  const mapping: Record<string, string> = {
    human: "human",
    ...AGENTS.reduce((acc, a) => ({ ...acc, [a.key]: a.key }), {}),
  };

  // __start__ always goes to orchestrator
  // game.addEdge("__start__", "orchestrator");

  // After orchestrator, dispatch based on state.nextActor
  // game.addConditionalEdges(
  //   "orchestrator",
  //   (state) => state.nextActor,
  //   mapping
  // );

  // After any turn, go back to the orchestrator
  // for (const nodeName of Object.values(mapping)) {
  //   game.addEdge(nodeName, "orchestrator");
  // }

  // 3. Entry (and optional exit)
  game.setEntryPoint("__start__");
  // game.setFinishPoint(END); // define a terminal condition as needed

  return game;
}

// Example of compiling & running:
const app = buildGameGraph().compile();

const draw = async () => {
  try {
    const drawableGraph = await app.getGraphAsync();
    const png = await drawableGraph.drawMermaidPng();
    const buffer = Buffer.from(await png.arrayBuffer());
    writeFileSync('graph.png', buffer);
  } catch (error) {
    console.error("Error generating graphic:", error);
    throw error;
  }
}

const main = async () => {
  await draw();
  console.log("Graphic generated successfully");

  const initialState: GameState = {
    messages: [],
    currentSuspects: [],
    nextActor: "",
  };
  const result = await app.invoke(initialState);

  return;
};

main()
  .then(() => console.log("Workflow executed successfully"))
  .catch((error) => console.error("Error executing workflow:", error));
