import { Annotation, messagesStateReducer } from '@langchain/langgraph'

export const StateAnnotation = Annotation.Root({
  messages: Annotation({
    reducer: messagesStateReducer, // how you update your state
    default: () => [],
  }),
  /** add any keys regards to your business requirements below */
})
