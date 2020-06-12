"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchShebang = exports.removeShebang = exports.shebang = exports.reShebang = void 0;
exports.reShebang = /^\s*#!\s*([^\s]+)(?:\s+([^\s]+)(?:\s+([^\r\n]+))?(?=\r|\n|$))?/;
/**
 * Extract normalized shebang command token.
 *
 *
 * Examples:
 *
 *  shebang("#!/usr/bin/ruby") // "ruby"
 *
 *  shebang("#!/usr/bin/env node") // "node"
 *
 *  @param: {String}
 *  @return {String|null}
 */
function shebang(line) {
    var _a;
    return (_a = matchShebang(line)) === null || _a === void 0 ? void 0 : _a.script;
}
exports.shebang = shebang;
function removeShebang(line) {
    return line.replace(exports.reShebang, '');
}
exports.removeShebang = removeShebang;
function matchShebang(line) {
    const matched = line.match(exports.reShebang);
    if ((matched === null || matched === void 0 ? void 0 : matched.length) > 0) {
        const paths = matched[1].split('/');
        let script = paths[paths.length - 1];
        let name = script;
        let i = 2;
        let isExtra = false;
        if (script === 'env') {
            script = matched[2];
            i = 3;
            isExtra = true;
        }
        let rest = matched.slice(i).filter(v => typeof v !== 'undefined');
        return {
            shebang: matched[0],
            bin: matched[1],
            name,
            script,
            argv: rest.join(' '),
            isExtra,
        };
    }
}
exports.matchShebang = matchShebang;
exports.default = shebang;
//# sourceMappingURL=index.js.map