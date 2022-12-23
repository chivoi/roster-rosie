"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../..");
describe("hello", function () {
    it("should say hello", function () {
        expect((0, src_1.hello)("ana")).toBe("Hello ana!");
    });
});
