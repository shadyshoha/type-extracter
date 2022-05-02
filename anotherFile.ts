// import type { A } from "./test";
export interface B {
  text: string;
  nb: number;
  parent: F;
  location: {
    name: string;
    positiion: number;
  };
}

export interface F {
  d: "pending" | true;
  e: { st: string };
}
