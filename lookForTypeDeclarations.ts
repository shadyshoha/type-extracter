import { exit } from "process";
import * as ts from "typescript";

const log = console.log;

const maxRecursion = 1000000000000;

const tsKeywords = ["ReturnType", "Boolean", "Date", "Array"];
export const lookForTypeDeclarations = (
  node: ts.Node,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  identifiers: { [key: string]: { [key: string]: 1 } },
  indentLevel: number = 0
) => {
  const indentation = " -".repeat(indentLevel) + (indentLevel > maxRecursion ? "x" : "");
  log(indentation, ts.SyntaxKind[node.kind]);

  log(indentation, node.getText());

  if (tsKeywords.includes(node.getText())) return;

  if (indentLevel && indentLevel > maxRecursion) return;

  if (ts.isIdentifier(node)) {
    console.log(
      checker.getTypeAtLocation(node).aliasSymbol?.declarations?.length,
      checker.getTypeAtLocation(node).getSymbol()?.getDeclarations()?.length,
      checker.getTypeAtLocation(node).symbol?.valueDeclaration !== undefined,
      checker.getTypeAtLocation(node).aliasSymbol?.valueDeclaration !== undefined
    );
    const declarations =
      checker.getTypeAtLocation(node).aliasSymbol?.declarations ||
      checker.getTypeAtLocation(node).getSymbol()?.getDeclarations();
    const valueDeclaration = checker.getTypeAtLocation(node).symbol?.valueDeclaration;
    if (node.getText() === "F") {
      // log(valueDeclaration);
      // log(declarations);
      // log(checker.getTypeAtLocation(node).getSymbol()?.getDeclarations());
      // log(checker.getTypeAtLocation(node).symbol?.declarations);
      // log(checker.getTypeAtLocation(node).aliasSymbol?.valueDeclaration);
    }

    if (valueDeclaration) {
      if (isAlreadyKnown(node, valueDeclaration, identifiers)) return;
      lookForTypeDeclarations(valueDeclaration, sourceFile, checker, identifiers, indentLevel + 1);
    } else if (declarations) {
      declarations?.forEach((d) => {
        if (isAlreadyKnown(node, d, identifiers)) return;
        lookForTypeDeclarations(d, sourceFile, checker, identifiers, (indentLevel || 0) + 1);
      });
    } else {
      log(checker.typeToString(checker.getTypeAtLocation(node)));
    }
  } else {
    node
      .getChildren()
      .forEach((c) =>
        lookForTypeDeclarations(c, sourceFile, checker, identifiers, (indentLevel || 0) + 1)
      );
  }
};

const isAlreadyKnown = (
  node: ts.Identifier,
  declaration: ts.Declaration,
  identifiers: { [key: string]: { [key: string]: 1 } }
) => {
  if (ts.isSourceFile(declaration)) return false;
  if (
    identifiers[declaration.getSourceFile().fileName]?.[getFirstStageParent(declaration).getText()]
  ) {
    return true;
  } else {
    identifiers[declaration.getSourceFile().fileName] =
      identifiers[declaration.getSourceFile().fileName] || {};
    identifiers[declaration.getSourceFile().fileName][
      getFirstStageParent(declaration).getText()
    ] = 1;
    return false;
  }
};

const getFirstStageParent = (node: ts.Node): ts.Node => {
  if (ts.isSourceFile(node.parent)) return node;
  else return getFirstStageParent(node.parent);
};
