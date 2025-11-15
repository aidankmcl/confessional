
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

const StateSchema = Annotation.Root({
  nlist: Annotation<string[]>({
    reducer: (left, right) => left.concat(right),
    default: () => []
  })
});

type State = typeof StateSchema.State;

function nodeGenerator(note: string) {
  return (state: State) => ({ nlist: [note] });
}

const nodeA = nodeGenerator('A');
const nodeB = nodeGenerator('B');
const nodeBB = nodeGenerator('BB');
const nodeC = nodeGenerator('C');
const nodeCC = nodeGenerator('CC');
const nodeD = nodeGenerator('D');

export const graph = new StateGraph(StateSchema)
  .addNode('a', nodeA)
  .addNode('b', nodeB)
  .addNode('bb', nodeBB)
  .addNode('c', nodeC)
  .addNode('cc', nodeCC)
  .addNode('d', nodeD)
  .addEdge(START, 'a')
  .addEdge('a', 'b')
  .addEdge('a', 'c')
  .addEdge('b', 'bb')
  .addEdge('c', 'cc')
  .addEdge('bb', 'd')
  .addEdge('cc', 'd')
  .addEdge('d', END)
  .compile();


const main = async () => {
  const initialState: State = {
    nlist: ['Hello!']
  };

  const res = await graph.invoke(initialState);
  console.log(res);
}

main()
  .then(() => {
    console.log('done!');
  })
  .catch((err) => {
    console.error(err);
  });
