import { createContext } from "react";

// interface ICountContext {
//   counter: number,
//   count?: (c: number) => number
// }

// const defaultState = {
//   counter: 0,
//   count: (c: number): number => c + 1
// }

const Context = createContext(0); /* <ICountContext>(defaultState) */;
export default Context;