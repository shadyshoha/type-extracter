"use strict";
exports.__esModule = true;
exports.analyzeFunction = exports.analyzeClass = exports.t = void 0;
var tstl_1 = require("tstl");
var tsc = require("typescript");
var GenericAnalyzer_1 = require("./GenericAnalyzer");
var ImportAnalyzer_1 = require("./ImportAnalyzer");
exports.t = 2;
function analyzeClass(checker, classNode) {
    var ret = [];
    var classType = checker.getTypeAtLocation(classNode);
    var genericDict = GenericAnalyzer_1.GenericAnalyzer.analyze(checker, classNode);
    for (var _i = 0, _a = classType.getProperties(); _i < _a.length; _i++) {
        var property = _a[_i];
        console.log(property.getName());
        if (property.declarations)
            for (var _b = 0, _c = property.declarations; _b < _c.length; _b++) {
                var declaration = _c[_b];
                // TARGET ONLY METHOD
                if (!tsc.isMethodDeclaration(declaration))
                    continue;
                // IT MUST BE
                var identifier = declaration.name;
                if (!tsc.isIdentifier(identifier))
                    continue;
                ret.push(analyzeFunction(checker, genericDict, declaration));
            }
    }
    return ret;
}
exports.analyzeClass = analyzeClass;
function analyzeFunction(checker, genericDict, declaration) {
    // PREPARE ASSETS
    var signature = checker.getSignatureFromDeclaration(declaration);
    if (signature === undefined)
        throw new Error("Error on ControllerAnalyzer._Analyze_function()");
    var importDict = new tstl_1.HashMap();
    // EXPLORE CHILDREN TYPES
    // const parameters: IRoute.IParameter[] = func.parameters.map((param) =>
    //   _Analyze_parameter(
    //     checker,
    //     genericDict,
    //     importDict,
    //     func.name,
    //     param,
    //     declaration.parameters[param.index]
    //   )
    // );
    var output = ImportAnalyzer_1.ImportAnalyzer.analyze(checker, genericDict, importDict, checker.getReturnTypeOfSignature(signature));
    var imports = importDict
        .toJSON()
        .map(function (pair) { return [pair.first, pair.second.toJSON()]; });
    // RETURNS
    return {
        output: output,
        imports: imports,
        comments: signature.getDocumentationComment(undefined),
        tags: signature.getJsDocTags()
    };
}
exports.analyzeFunction = analyzeFunction;
// export namespace ControllerAnalyzer {
//   export function analyze(
//     checker: tsc.TypeChecker,
//     sourceFile: tsc.SourceFile,
//     controller: IController
//   ): IRoute[] {
//     // FIND CONTROLLER CLASS
//     const ret: IRoute[] = [];
//     tsc.forEachChild(sourceFile, (node) => {
//       if (tsc.isClassDeclaration(node) && node.name?.escapedText === controller.name) {
//         // ANALYZE THE CONTROLLER
//         ret.push(..._Analyze_controller(checker, controller, node));
//         return;
//       }
//     });
//     return ret;
//   }
//   /* ---------------------------------------------------------
//         CLASS
//     --------------------------------------------------------- */
//   function _Analyze_controller(
//     checker: tsc.TypeChecker,
//     controller: IController,
//     classNode: tsc.ClassDeclaration
//   ): IRoute[] {
//     const ret: IRoute[] = [];
//     const classType: tsc.InterfaceType = checker.getTypeAtLocation(classNode) as tsc.InterfaceType;
//     const genericDict: GenericAnalyzer.Dictionary = GenericAnalyzer.analyze(checker, classNode);
//     for (const property of classType.getProperties())
//       if (property.declarations)
//         for (const declaration of property.declarations) {
//           // TARGET ONLY METHOD
//           if (!tsc.isMethodDeclaration(declaration)) continue;
//           // IT MUST BE
//           const identifier = declaration.name;
//           if (!tsc.isIdentifier(identifier)) continue;
//           // ANALYZED WITH THE REFLECTED-FUNCTION
//           const func: IController.IFunction | undefined = controller.functions.find(
//             (f) => f.name === identifier.escapedText
//           );
//           if (func !== undefined)
//             ret.push(_Analyze_function(checker, controller, genericDict, func, declaration));
//         }
//     return ret;
//   }
//   /* ---------------------------------------------------------
//         FUNCTION
//     --------------------------------------------------------- */
//   function _Analyze_function(
//     checker: tsc.TypeChecker,
//     genericDict: GenericAnalyzer.Dictionary,
//     func: IController.IFunction,
//     declaration: tsc.MethodDeclaration
//   ): IRoute {
//     // PREPARE ASSETS
//     const signature: tsc.Signature | undefined = checker.getSignatureFromDeclaration(declaration);
//     if (signature === undefined)
//       throw new Error(
//         `Error on ControllerAnalyzer._Analyze_function()`
//       );
//     const importDict: ImportAnalyzer.Dictionary = new HashMap();
//     // EXPLORE CHILDREN TYPES
//     const parameters: IRoute.IParameter[] = func.parameters.map((param) =>
//       _Analyze_parameter(
//         checker,
//         genericDict,
//         importDict,
//         func.name,
//         param,
//         declaration.parameters[param.index]
//       )
//     );
//     const output: string = ImportAnalyzer.analyze(
//       checker,
//       genericDict,
//       importDict,
//       checker.getReturnTypeOfSignature(signature)
//     );
//     const imports: [string, string[]][] = importDict
//       .toJSON()
//       .map((pair) => [pair.first, pair.second.toJSON()]);
//     // CONFIGURE PATH
//     let path: string = NodePath.join(controller.path, func.path).split("\\").join("/");
//     if (path[0] !== "/") path = "/" + path;
//     if (path[path.length - 1] === "/" && path !== "/") path = path.substr(0, path.length - 1);
//     // RETURNS
//     return {
//       ...func,
//       path,
//       parameters,
//       output,
//       imports,
//       symbol: `${controller.name}.${func.name}()`,
//       comments: signature.getDocumentationComment(undefined),
//       tags: signature.getJsDocTags(),
//     };
//   }
//   /* ---------------------------------------------------------
//         PARAMETER
//     --------------------------------------------------------- */
//   function _Analyze_parameter(
//     checker: tsc.TypeChecker,
//     genericDict: GenericAnalyzer.Dictionary,
//     importDict: ImportAnalyzer.Dictionary,
//     funcName: string,
//     param: IController.IParameter,
//     declaration: tsc.ParameterDeclaration
//   ): IRoute.IParameter {
//     const symbol: tsc.Symbol = checker.getSymbolAtLocation(declaration.name)!;
//     const type: tsc.Type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
//     const name: string = symbol.getEscapedName().toString();
//     // VALIDATE PARAMETERS
//     if ((param.category === "query" || param.category === "body") && param.field !== undefined)
//       throw new Error(
//         `Error (): parameter ${name} is specifying a field ${param.field} of the request ${param.category} message, however, Nestia does not support the field specialization for the request ${param.category} message. Erase the ${funcName}()#${name} parameter and re-define a new decorator accepting full structured message.`
//       );
//     return {
//       name,
//       category: param.category,
//       field: param.field,
//       encrypted: param.encrypted,
//       type: ImportAnalyzer.analyze(checker, genericDict, importDict, type),
//     };
//   }
// }
