
import { StateAnnotation } from './state';

const one = async (state: typeof StateAnnotation.State) => {
  // return the current state for now
  return state
}

const two = async (state: typeof StateAnnotation.State) => {
  // return the current state for now
  return state
}

const three = async (state: typeof StateAnnotation.State) => {
  // return the current state for now
  return state
}

export const nodes = {
  one,
  two,
  three,
};
