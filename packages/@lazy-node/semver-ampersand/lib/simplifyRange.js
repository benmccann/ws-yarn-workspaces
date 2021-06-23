"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyRange = void 0;
const tslib_1 = require("tslib");
const simplify_1 = (0, tslib_1.__importDefault)(require("semver/ranges/simplify"));
const handleVersionRange_1 = require("./handleVersionRange");
function simplifyRange(ranges, range, options) {
    return (0, simplify_1.default)(ranges, (0, handleVersionRange_1.handleVersionRange)(range), options);
}
exports.simplifyRange = simplifyRange;
exports.default = simplifyRange;
//# sourceMappingURL=simplifyRange.js.map