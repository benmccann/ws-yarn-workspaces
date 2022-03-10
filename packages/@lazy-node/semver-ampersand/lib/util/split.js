"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitSpace = exports.splitDoubleVerticalBar = void 0;
const tslib_1 = require("tslib");
const split_smartly2_1 = tslib_1.__importDefault(require("split-smartly2"));
const const_1 = require("../const");
exports.splitDoubleVerticalBar = (0, split_smartly2_1.default)(const_1.reDoubleVerticalBar, {
    includeSeparatorMode: "NONE" /* EnumIncludeSeparatorMode.INCLUDE_SEPARATOR_NONE */,
    brackets: true,
});
exports.splitSpace = (0, split_smartly2_1.default)(const_1.reSpaces, {
    includeSeparatorMode: "NONE" /* EnumIncludeSeparatorMode.INCLUDE_SEPARATOR_NONE */,
    brackets: true,
});
//# sourceMappingURL=split.js.map