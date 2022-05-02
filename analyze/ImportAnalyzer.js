"use strict";
exports.__esModule = true;
exports.ImportAnalyzer = void 0;
var tsc = require("typescript");
var HashSet_1 = require("tstl/container/HashSet");
var ImportAnalyzer;
(function (ImportAnalyzer) {
    function analyze(checker, genericDict, importDict, type) {
        return explore(checker, genericDict, importDict, type);
    }
    ImportAnalyzer.analyze = analyze;
    function explore(checker, genericDict, importDict, type) {
        //----
        // CONDITIONAL BRANCHES
        //----
        // DECOMPOSE GENERIC ARGUMENT
        while (genericDict.has(type) === true)
            type = genericDict.get(type);
        // PRIMITIVE
        var symbol = type.getSymbol() || type.aliasSymbol;
        if (symbol === undefined)
            return checker.typeToString(type, undefined, undefined);
        // UNION OR INTERSECT
        else if (type.aliasSymbol === undefined && type.isUnionOrIntersection()) {
            var joiner = type.isIntersection() ? " & " : " | ";
            return type.types
                .map(function (child) { return explore(checker, genericDict, importDict, child); })
                .join(joiner);
        }
        //----
        // SPECIALIZATION
        //----
        var name = get_name(symbol);
        var sourceFile = symbol.declarations[0].getSourceFile();
        if (sourceFile.fileName.indexOf("typescript/lib") === -1) {
            var it = importDict.find(sourceFile.fileName);
            if (it.equals(importDict.end()) === true)
                it = importDict.emplace(sourceFile.fileName, new HashSet_1.HashSet()).first;
            it.second.insert(name.split(".")[0]);
        }
        // CHECK GENERIC
        var generic = checker.getTypeArguments(type);
        if (generic.length) {
            return name === "Promise"
                ? explore(checker, genericDict, importDict, generic[0])
                : "".concat(name, "<").concat(generic
                    .map(function (child) { return explore(checker, genericDict, importDict, child); })
                    .join(", "), ">");
        }
        else
            return name;
    }
    function get_name(symbol) {
        var name = symbol.escapedName.toString();
        var decl = symbol.getDeclarations()[0].parent;
        while (tsc.isModuleBlock(decl)) {
            name = "".concat(decl.parent.name.getText(), ".").concat(name);
            decl = decl.parent.parent;
        }
        return name;
    }
})(ImportAnalyzer = exports.ImportAnalyzer || (exports.ImportAnalyzer = {}));
