"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDependencyTable = void 0;
const semver_diff_1 = require("@yarn-tool/semver-diff");
const core_1 = require("./core");
function toDependencyTable(args) {
    const table = core_1.createDependencyTable();
    const rows = Object.keys(args.to).map(dep => {
        const from = args.from[dep] || '';
        const to = semver_diff_1.colorizeDiff(args.from[dep], args.to[dep] || '', args.options);
        return [dep, from, '→', to];
    });
    rows.forEach(row => table.push(row));
    return table;
}
exports.toDependencyTable = toDependencyTable;
exports.default = toDependencyTable;
//# sourceMappingURL=deps-table.js.map