import assert from "power-assert"
import astEqual from "ast-equal"
import ASTSource from "../src/ASTSource"
import ASTOutput from "../src/ASTOutput"
import {ParserTypes} from "../src/ASTSource"
import {toAssertFromAST} from "comment-to-assert"

describe("ASTSource", () => {
    describe("Constructor", function () {
        it("should require `filePath`", function () {
            var source = new ASTSource("var a;", {
                filePath: "file.js"
            });
            assert(source instanceof ASTSource);
        });
        context("when `disableSourceMap` is true", function () {
            it("should not require `filePath`", function () {
                var source = new ASTSource("var a;", {
                    disableSourceMap: true
                });
                assert(source instanceof ASTSource);
            });
        });
    });

    describe("#parse", function () {
        it("should parse source code", function () {
            var source = new ASTSource("var a = 1", {
                filePath: "file.js",
                parserType: ParserTypes.Babylon
            });
            assert(source.value());
            var AST = source.parse("var b");
            assert(typeof AST !== "undefined");
        });
        it("should use parser by defined parserType", function () {
            var source = new ASTSource("var jsx = <div></div>", {
                filePath: "file.js",
                parserType: ParserTypes.Babylon
            });
            assert(source.value());
        });
    });
    describe("#transform", function () {
        it("should update .value", function () {
            var source = new ASTSource("1;// => 1", {
                filePath: "file.js"
            });
            var beforeValue = source.cloneValue();
            source.transform(toAssertFromAST);
            var afterValue = source.cloneValue();
            assert.notDeepEqual(beforeValue, afterValue);
            var output = source.output();
            assert(typeof output.code !== "undefined");
            assert.equal(output.code, `assert.equal(1, 1);`);
        });
        it("should pass AST to transform function", function () {
            var source = new ASTSource("1;// => 1", {
                filePath: "file.js"
            });
            source.transform(function (AST) {
                assert(typeof AST !== "undefined");
                return AST;
            });
        });
        it("transform return null then throw Error", function () {
            var source = new ASTSource("1;// => 1", {
                filePath: "file.js"
            });
            assert.throws(function () {
                source.transform(function () {
                    // too bad
                    return null;
                });
            }, Error);
        });
    });
    describe("#output", function () {
        it("should return Object", function () {
            var code = "var a; // comment";
            var source = new ASTSource(code, {
                filePath: "file.js"
            });
            var result = source.output();
            assert(result instanceof ASTOutput);
            astEqual(result.code, code);
        });
        context("when `disableSourceMap` is true", function () {
            it("output should not has `map` property", function () {
                var code = "var a;";
                var source = new ASTSource(code, {
                    disableSourceMap: true
                });
                var output = source.output();
                assert(typeof output.code !== "undefined");
                assert(output.map == null);
                assert.equal(output.codeWithMap, code);
            });
        });
    });
});
