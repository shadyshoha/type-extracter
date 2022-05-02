import * as ts from "typescript";
import * as fs from "fs";

interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
}

const JsonType = {};
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
      ts.forEachChild(sourceFile, (c) => visit(c, checker, output));
    }
  }
  // print out the doc
  fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));

  return;
};

/** True if this is visible outside this file, false otherwise */
const isNodeExported = (node: ts.Node): boolean => {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
};

const primitives = ["string", "boolean", "number", "true", "false", "any", "undefined"];

/** visit nodes finding exported classes */
const visit = (node: ts.Node, checker: ts.TypeChecker, output: DocEntry[]) => {
  // Only consider exported nodes

  if (!isNodeExported(node)) {
    return;
  }
  if (ts.isTypeAliasDeclaration(node)) {
    serializeTypeAlias(checker.getTypeAtLocation(node), checker);
  } else if (ts.isIdentifier(node)) {
    // let symbol = checker.getSymbolAtLocation(node);
    // log("Identifier");
    // explore(checker.getTypeAtLocation(node), checker);
  } else if (ts.isVariableDeclaration(node)) {
    // let symbol = checker.getSymbolAtLocation(node);
    log("Variable declaration");
    // explore(checker.getTypeAtLocation(node), checker);
  } else {
    // log(checker.typeToString(checker.getTypeAtLocation(node)));
  }
};

/** Serialize a type alias symbol information */
const serializeTypeAlias = (type: ts.Type, checker: ts.TypeChecker) => {
  // PRIMITIVE
  const types = {};
  log("serializeTypeAlias");
  log(explore(type, checker, types));
  log(types);
};

type typesDict = { [key: string]: { [key: string]: string } };

const reverseSyntaxKind = (k: number) => {
  return Object.entries(ts.SyntaxKind).find((a) => a[1] === k)?.[0];
};

const explore = (type: ts.Type, checker: ts.TypeChecker, types: typesDict): any => {
  if (!type) return "any";

  if (type.isLiteral()) return checker.typeToString(type, undefined, undefined);

  if (primitives.includes(checker.typeToString(type))) return checker.typeToString(type);
  // UNION OR INTERSECT
  if (type.isUnionOrIntersection()) {
    const joiner: string = type.isIntersection() ? " & " : " | ";
    log(type.types.length);
    return type.types.map((child) => explore(child, checker, types)).join(joiner);
  }
  if (type.getCallSignatures()?.length) {
    const signature = type.getCallSignatures()[0];
    var paramsTypes = "(";
    signature.parameters.forEach((p) => {
      const t = checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration!);
      paramsTypes = paramsTypes + p.escapedName + ": " + explore(t, checker, types) + ", ";
    });
    paramsTypes = paramsTypes + ")";
    const returnType = explore(signature.getReturnType(), checker, types);
    return paramsTypes + " => " + returnType;
  }
  if (type.symbol?.name === "Array") {
    return explore(checker.getTypeArguments(type as any)?.[0], checker, types) + "[]";
  }
  if (isArray(type)) {
    const indexTypes = (type.getNumberIndexType() as any).types.map((t: ts.Type) =>
      explore(t, checker, types)
    );
    return "[" + indexTypes.join(", ") + "]";
  }
  if (type.getProperties().length) {
    if (type.symbol.name !== "__type" && type.symbol.name !== "__object" && type.symbol.name) {
      if (!types[getSourceFile(type)] || !types[getSourceFile(type)][type.symbol.name]) {
        if (!types[getSourceFile(type)]) types[getSourceFile(type)] = {};
        types[getSourceFile(type)][type.symbol.name] = "temp";
        types[getSourceFile(type)][type.symbol.name] = exploreProps(type, checker, types);
      }
      return checker.typeToString(type);
    }
    return exploreProps(type, checker, types);
  }
  return "any";
};

const isArray = (type: ts.Type) => {
  return type
    .getProperties()
    .map((p) => p.escapedName)
    .some((p) => String(p).startsWith("__@iterator"));
};

const exploreProps = (type: ts.Type, checker: ts.TypeChecker, types: typesDict) => {
  var tp = "{";
  type.getProperties().forEach((p) => {
    const isRequired = !(p.valueDeclaration as any)?.questionToken;
    const t = checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration!);
    tp = tp + p.name + (isRequired ? "" : "?") + ":" + explore(t, checker, types) + ",";
  });
  return tp + "}";
};

const getSourceFile = (type: ts.Type) => {
  return type.symbol.declarations![0].getSourceFile().fileName;
};

generateDocumentation(["./test.ts"], {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  tsConfigFilePath: "./tsconfig.json",
});
