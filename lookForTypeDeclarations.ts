import * as ts from "typescript";
const log = console.log;

export const lookForTypeDeclarations = (
  node: ts.Node,
  sourceFile: ts.Node,
  checker: ts.TypeChecker
) => {
  log("##### Type");
  if (ts.isIdentifier(node)) {
    log("##### Is Identifier ####");
    log(checker.typeToString(checker.getTypeAtLocation(node)));
  }
  log(checker.typeToString(checker.getTypeAtLocation(node)));
  node.forEachChild((child) => lookForTypeDeclarations(child, sourceFile, checker));
  log("-------");
};
