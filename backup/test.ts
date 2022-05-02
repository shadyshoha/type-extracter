type routeObject = {
  [key: string]: string;
};

const a = { a: { yo: "text" } };
const b = { b: "text2" };

const c = { ...a, ...b };

class A<Type extends routeObject> {
  constructor(public routes: Type) {}

  get<P extends string>(name: P, route: string) {
    const routes: Type & Record<P, string> = { ...this.routes, [name]: route };
    return new A(routes);
  }
}

const cA = new A({ test: "test" });
const cB = cA.get("salut", "salut").get("maison", "maison");
const r = cB.routes.maison;
