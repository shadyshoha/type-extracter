import { ArrowFunction, KindToNodeMappings, Node, Project, SyntaxKind, Type } from "ts-morph";
const fs = require("fs");

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});

const file = project.getSourceFile("./file.ts");

function getSiblingsOfKind<T extends SyntaxKind>(node: Node, kind: T): KindToNodeMappings[T][] {
  return [...node.getNextSiblings(), ...node.getPreviousSiblings()].filter(
    (sibling) => sibling.getKind() === kind
  ) as KindToNodeMappings[T][];
}

const getInterfaces = (typeR: Type) => {
  console.log(typeR.isUnion());
  console.log(typeR.getUnionTypes()?.length);
  if (typeR.isUnion()) {
    typeR.getUnionTypes().forEach((tp: any) => getInterfaces(tp));
    return;
  }
  let args = typeR.getTypeArguments();
  for (const iterator of args) {
    const typeName = iterator.getText();
    console.log(typeName);
    let sym = iterator.getSymbol();
    if (sym) {
      let decl = sym.getDeclarations();
      if (decl) {
        let sourceOfInsideTypes = decl.map((x: any) => x.getSourceFile());
        console.log(sourceOfInsideTypes[0]?.getInterface(typeName)?.getText());
        console.log(sourceOfInsideTypes[0]?.getInterface(typeName)?.getText());
      }
    }
  }
};

const getInterfaces2 = (typeR: Type) => {
  console.log(typeR.getText(), "here");
  if (typeR.isUnion()) typeR.getUnionTypes().forEach((tp: any) => getInterfaces2(tp));
  else {
    if (typeR.isInterface()) {
      const typeName = typeR.getText();
      let sym = typeR.getSymbol();
      if (sym) {
        let decl = sym.getDeclarations();
        if (decl) {
          let sourceOfInsideTypes = decl.map((x: any) => x.getSourceFile());
          console.log(sourceOfInsideTypes[0]?.getInterface(typeName)?.getText());
          console.log(sourceOfInsideTypes[0]?.getInterface(typeName)?.getText());
        }
      }
    } else {
      let args = typeR.getTypeArguments();
      for (const iterator of args) {
        if (iterator.isUnion()) {
          iterator.getUnionTypes().forEach((tp: any) => {
            getInterfaces2(tp);
          });
        } else {
          console.log(iterator.getText(), "hereA");
          const typeName = iterator.getText();
          let sym = iterator.getSymbol();
          if (sym) {
            let decl = sym.getDeclarations();
            if (decl) {
              let sourceOfInsideTypes = decl.map((x: any) => x.getSourceFile());
              console.log(sourceOfInsideTypes[0]?.getInterface(typeName)?.getText());
              console.log(sourceOfInsideTypes[0]?.getInterface(typeName)?.getText());
            }
          }
        }
      }
    }
  }
};

function getArrowFunctionReturnType(arrowFunction?: ArrowFunction) {
  if (!arrowFunction) return undefined;

  let typeR = arrowFunction.getReturnType();

  //   console.log(typeR.getUnionTypes()[1].getTypeArguments()[0].getUnionTypes()[0].getText());
  //   console.log(typeR.getUnionTypes()[1].getTypeArguments()[0].isUnion());
  getInterfaces2(typeR);

  return typeR?.getText();
}

const res: any = file
  ?.getDescendantsOfKind(SyntaxKind.Identifier)
  .filter((val) => val.getText() === "createUser")
  .map((el) =>
    el.getNextSiblings().map((el) =>
      el
        .getDescendants()
        .filter((el) => el.getText() === "controller")
        .map((d) => getSiblingsOfKind(d, SyntaxKind.ArrowFunction).map(getArrowFunctionReturnType))
        .flat()
    )
  );

console.log(res[0][1][0]);

const app: { fct: (p: { ah: boolean }) => boolean } = {
  fct: null as any,
};

app.fct = (p) => {
  return p.ah;
};
