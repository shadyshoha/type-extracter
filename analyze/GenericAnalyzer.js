"use strict";
exports.__esModule = true;
exports.GenericAnalyzer = void 0;
var tsc = require("typescript");
var GenericAnalyzer;
(function (GenericAnalyzer) {
    function analyze(checker, classNode) {
        var dict = new WeakMap();
        explore(checker, dict, classNode);
        return dict;
    }
    GenericAnalyzer.analyze = analyze;
    function explore(checker, dict, classNode) {
        if (classNode.heritageClauses === undefined)
            return;
        for (var _i = 0, _a = classNode.heritageClauses; _i < _a.length; _i++) {
            var heritage = _a[_i];
            var _loop_1 = function (hType) {
                // MUST BE CLASS
                var expression = checker.getTypeAtLocation(hType.expression);
                var superNode = expression.symbol.getDeclarations()[0];
                if (!tsc.isClassDeclaration(superNode))
                    return "continue";
                // SPECIFY GENERICS
                var usages = if_undefined_array(hType.typeArguments);
                var parameters = if_undefined_array(superNode.typeParameters);
                parameters.forEach(function (param, index) {
                    var paramType = checker.getTypeAtLocation(param);
                    var usageType = usages[index] !== undefined
                        ? checker.getTypeAtLocation(usages[index])
                        : checker.getTypeAtLocation(param["default"]);
                    dict.set(paramType, usageType);
                });
                // RECUSRIVE EXPLORATION
                explore(checker, dict, superNode);
            };
            for (var _b = 0, _c = heritage.types; _b < _c.length; _b++) {
                var hType = _c[_b];
                _loop_1(hType);
            }
        }
    }
    function if_undefined_array(array) {
        return array !== undefined ? array : [];
    }
})(GenericAnalyzer = exports.GenericAnalyzer || (exports.GenericAnalyzer = {}));
