"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertExecInstall = void 0;
const tslib_1 = require("tslib");
const err_code_1 = (0, tslib_1.__importDefault)(require("err-code"));
function assertExecInstall(cp) {
    if (cp.status) {
        throw (0, err_code_1.default)(new Error(`Process finished with exit code ${cp.status}`), 'EXIT_CODE', {
            status: cp.status,
            cp,
        });
    }
    return cp;
}
exports.assertExecInstall = assertExecInstall;
//# sourceMappingURL=assertExecInstall.js.map