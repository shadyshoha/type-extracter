import * as ts from "typescript";
import * as fs from "fs";
import { lookForTypeDeclarations } from "./lookForTypeDeclarations";

interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
}

const log = console.log;

/** Generate documentation for all classes in a set of .ts files */
const generateDocumentation = (fileNames: string[], options: ts.CompilerOptions): void => {
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();
  let output: DocEntry[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, (c) => visit(c, checker, sourceFile));
    }
  }
  // print out the doc
  fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));

  return;
};

const visit = (node: ts.Node, checker: ts.TypeChecker, sourceFile: ts.SourceFile) => {
  if (!isNodeExported(node)) {
    return;
  }
  if (ts.isTypeAliasDeclaration(node)) {
    log("Type alias declaration", checker.typeToString(checker.getTypeAtLocation(node)));
    if (node.name.escapedText === "typeEducation") {
      const type = checker.getTypeAtLocation(node);
      node.forEachChild((child) => lookForTypeDeclarations(child, sourceFile, checker));
    }
  } else if (ts.isInterfaceDeclaration(node)) {
    log("Interface declaration", checker.typeToString(checker.getTypeAtLocation(node)));
  } else if (ts.isImportDeclaration(node)) {
    log("Import declaration", checker.typeToString(checker.getTypeAtLocation(node)));
  } else if (ts.isIdentifier(node)) {
    log("Identifier");
  } else if (ts.isVariableDeclaration(node)) {
    log("Variable declaration: ");
  }
};

/** True if this is visible outside this file, false otherwise */
const isNodeExported = (node: ts.Node): boolean => {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
};

generateDocumentation(["./file.ts"], {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  tsConfigFilePath: "./tsconfig.json",
});
