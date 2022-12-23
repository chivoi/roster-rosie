"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
describe("hello", function () {
    it("should say hello", function () {
        expect((0, __1.hello)("ana")).toBe("Hello ana!");
    });
});
