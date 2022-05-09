// import type { A } from "./test";
export interface BB {
  text: string;
  nb: number;
  parent: F;
  location: {
    name: string;
    positiion: number;
  };
}

type B = 4 | 5;

export interface F {
  d: B;
  e: { st: string };
}

export default () => {
  return false;
};
