"use strict";
/**
 * Created by user on 2020/6/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeListableExtra = exports.normalizeListableRowExtra = exports.normalizeListable = exports.normalizeListableRow = void 0;
const upath2_1 = require("upath2");
function normalizeListableRow(row) {
    row.location = upath2_1.normalize(row.location);
    return row;
}
exports.normalizeListableRow = normalizeListableRow;
function normalizeListable(list) {
    return list.map((row) => {
        return normalizeListableRow(row);
    });
}
exports.normalizeListable = normalizeListable;
function normalizeListableRowExtra(_row, root) {
    let row = normalizeListableRow(_row);
    row.prefix = upath2_1.relative(root, row.location);
    return row;
}
exports.normalizeListableRowExtra = normalizeListableRowExtra;
function normalizeListableExtra(list, root) {
    return list.map((row) => {
        return normalizeListableRowExtra(row, root);
    });
}
exports.normalizeListableExtra = normalizeListableExtra;
//# sourceMappingURL=util.js.map