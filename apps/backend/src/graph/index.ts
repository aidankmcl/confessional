import { writeFileSync } from 'node:fs';

import { StateGraph, START, END } from '@langchain/langgraph'

import { StateAnnotation } from './state';
import { nodes } from './nodes';

const workflow = new StateGraph(StateAnnotation)
  .addNode('one', nodes.one)
  .addNode('two', nodes.two)
  .addNode('three', nodes.three)
  // Conecting Edges Here
  .addEdge(START, 'one')
  .addEdge('one', 'two')
  .addEdge('two', 'three')
  .addEdge("three", END);

const graph = workflow.compile();

const draw = async () => {
  try {
    const drawableGraph = await graph.getGraphAsync();
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

  return;
};

main()
  .then(() => console.log("Workflow executed successfully"))
  .catch((error) => console.error("Error executing workflow:", error));
