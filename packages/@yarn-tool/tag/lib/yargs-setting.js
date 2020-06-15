"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = void 0;
function setupToYargs(yargs) {
    return yargs
        .option('cwd', {
        default: process.cwd(),
        normalize: true,
    })
        .option('tag-prefix', {
        alias: 't',
        string: true,
    })
        .option('exclude-name', {
        boolean: true,
    });
}
exports.setupToYargs = setupToYargs;
exports.default = setupToYargs;
//# sourceMappingURL=yargs-setting.js.map