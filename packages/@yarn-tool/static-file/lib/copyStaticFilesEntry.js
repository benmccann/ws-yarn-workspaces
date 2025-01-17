"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyStaticFilesEntry = copyStaticFilesEntry;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const __root_1 = require("../__root");
function copyStaticFilesEntry(entry, cwd, staticRoot = __root_1.__STATIC_ROOT, overwrite) {
    const [targetFile, staticFile, detectFile] = entry;
    if (detectFile === null || detectFile === void 0 ? void 0 : detectFile.length) {
        const fc = (0, path_1.resolve)(cwd, detectFile);
        if ((0, fs_extra_1.existsSync)(fc)) {
            return;
        }
    }
    const fb = (0, path_1.resolve)(staticRoot, staticFile);
    if (!(0, fs_extra_1.existsSync)(fb)) {
        throw new Error(`file not exists. ${fb}`);
    }
    const fa = (0, path_1.resolve)(cwd, targetFile);
    (0, fs_extra_1.ensureDirSync)((0, path_1.dirname)(fa));
    (0, fs_extra_1.copySync)(fb, fa, {
        overwrite: overwrite || false,
        preserveTimestamps: true,
        errorOnExist: false,
    });
    return true;
}
//# sourceMappingURL=copyStaticFilesEntry.js.map