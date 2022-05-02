// import { Project, SyntaxKind } from "ts-morph";
// const print = (text: any) => console.log(text);

// const project = new Project({ tsConfigFilePath: "./tsconfig.json" });

// // const typechecker = project.getTypeChecker();

// const file = project.getSourceFile("./file.ts");

// // console.log(file);

// const router = file?.getClass("A");
// // console.log(router);

// const properties = router?.getProperties();

// const propertiedDeclarations = router?.getDescendantsOfKind(SyntaxKind.PropertyDeclaration);

// propertiedDeclarations?.forEach((c) => console.log(c.getType().getText()));

// const getInterface = () => {};

// import * as ts from "typescript";

// /**
//  * Prints out particular nodes from a source file
//  *
//  * @param file a path to a file
//  * @param identifiers top level identifiers available
//  */
// function extract(file: string, identifiers: string[], options: { tsConfigFilePath: string }): void {
//   // Create a Program to represent the project, then pull out the
//   // source file to parse its AST.
//   let program = ts.createProgram([file], { allowJs: true, ...options });
//   const sourceFile = program.getSourceFile(file);

//   console.log("Source file");
//   if (!sourceFile) return;

//   // To print the AST, we'll use TypeScript's printer
//   const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

//   // To give constructive error messages, keep track of found and un-found identifiers
//   const unfoundNodes: any = [],
//     foundNodes: any = [];

//   // Loop through the root AST nodes of the file
//   ts.forEachChild(sourceFile, (node) => {
//     console.log("Foreach child");
//     if (!node) return;
//     let name = "";

//     // This is an incomplete set of AST nodes which could have a top level identifier
//     // it's left to you to expand this list, which you can do by using
//     // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
//     // as below
//     if (ts.isFunctionDeclaration(node)) {
//       name = node.name?.text || "";
//       // Hide the method body when printing
//       (node as any).body = undefined;
//     } else if (ts.isVariableStatement(node)) {
//       name = node.declarationList.declarations[0].name.getText(sourceFile);
//     } else if (ts.isInterfaceDeclaration(node)) {
//       name = node.name.text;
//     }

//     const container = identifiers.includes(name) ? foundNodes : unfoundNodes;
//     container.push([name, node]);
//   });

//   // Either print the found nodes, or offer a list of what identifiers were found
//   if (!foundNodes.length) {
//     console.log(
//       `Could not find any of ${identifiers.join(", ")} in ${file}, found: ${unfoundNodes
//         .filter((f: any) => f[0])
//         .map((f: any) => f[0])
//         .join(", ")}.`
//     );
//     process.exitCode = 1;
//   } else {
//     foundNodes.map((f: any) => {
//       const [name, node] = f;
//       console.log("### " + name + "\n");
//       console.log(printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)) + "\n";
//     });
//   }
// }

// // Run the extract function with the script's arguments
// extract("./file.ts", ["user"], { tsConfigFilePath: "./tsconfig.json" });
