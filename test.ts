import { t } from "./analyze/ControllerAnalyzer";
import type { B } from "./anotherFile";
/**
 * Documentation for C
 */
// class C {
//   /**
//    * constructor documentation
//    * @param a my parameter documentation
//    * @param b another parameter documentation
//    */
//   constructor(private a: string, public b: B) {}

//   getName(r: { str: string }) {
//     if (r.str) return new X("salut", { yo: "coucou" } as const);
//     return "salut" as const;
//   }
//   getTest(a: L) {
//     if (a) return a.str;
//     return { b: "text", bool: false };
//   }
// }

class X {
  /**
   * constructor documentation
   * @param a my parameter documentation
   * @param b another parameter documentation
   */
  constructor(private a: string, public b: { yo: string }) {}

  public getName(r: { str: string; b: C }) {
    return "salut" as const;
  }
  public getTest(a: L) {
    if (a) return a.str;
    return { b: "text", bool: false };
  }
}

type Gen<T> = {
  testGen: T;
};

const var2 = "Salut";

const var1 = {
  prudd: "Salut",
  vlaue: 34,
  // pr: ["salut", "ot"],
  pt: {
    salu: "Coucou",
  },
} as const;

interface L {
  str: "LOL";
}

import { Request } from "express";

export type typeEducation = { test: Request["url"] };

//   degree: number;
//   school?: "accepted" | "refused";
//   // school: string;
//   b: any;
//   e: typeof var2;
//   fd?: typeof var1[];
//   typeWithConstArray: [string, number];
//   genEd?: Gen<{ wow?: true }>;
//   d: { text: string } & A;
// } & ({ txt: string } | { text: true });

export type typeWithArray = { arr?: { t: string }; arr2: string };

export interface A {
  name: string;
  b: B;
  c: C;
}
