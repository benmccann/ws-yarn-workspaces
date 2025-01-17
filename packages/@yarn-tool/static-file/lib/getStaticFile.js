"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticFile = getStaticFile;
const const_1 = require("./const");
const getRowOfStaticFilesMapArray_1 = require("./getRowOfStaticFilesMapArray");
function getStaticFile(file_id, options) {
    return (0, getRowOfStaticFilesMapArray_1.getRowOfStaticFilesMapArray)((options === null || options === void 0 ? void 0 : options.file_map) || const_1.defaultCopyStaticFiles, file_id);
}
//# sourceMappingURL=getStaticFile.js.map