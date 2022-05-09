type Intersect<T> = (T extends any ? (x: T) => 0 : never) extends (x: infer R) => 0 ? R : never;

type Foo<T extends any[]> = {
  [K in keyof T]: { foo: T[K] };
};
type TupleKeys<T extends any[]> = Exclude<keyof T, keyof []>;

type Values<T> = T[keyof T];

type Unfoo<T> = T extends { foo: any } ? T["foo"] : never;

type nFoo<T extends any[]> = {
  [K in TupleKeys<T>]: T[K] extends (...args: any) => any
    ? { foo: ReturnType<T[K]> extends { error: any } ? never : ReturnType<T[K]> }
    : never;
};

type Test = [() => { a: 1 } | { error: 2 }, () => { c: 3 }];

type hh = nFoo<Test>;
type p = Intersect<Values<nFoo<Test>>>;
type f = Unfoo<p>;

const ab: f = 3 as any;

type JJ = keyof f;

type rec<T extends any[]> = T extends [infer A, ...infer R]
  ? [A, ...rec<R>]
  : T extends [infer B]
  ? [B]
  : [];

type Apply = <T extends any[]>(...args: T) => rec<T>;

if ("a" in ab) {
  ab;
}

type t3 = { error: true } | { test: "ok" };

type RemoveError<T> = T extends { error: any } ? never : T;

type t4 = RemoveError<f>;
