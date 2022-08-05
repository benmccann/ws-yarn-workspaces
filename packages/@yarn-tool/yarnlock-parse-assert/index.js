"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertYarnLockParsedIsSupported = exports.isYarnLockParsedV2 = exports.isYarnLockParsedV1 = exports.assertYarnLockParsed = exports.isYarnLockParsed = void 0;
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const detect_yarnlock_version_1 = require("@yarn-tool/detect-yarnlock-version");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
function isYarnLockParsed(parsedObject) {
    return (0, detect_yarnlock_version_1.detectYarnLockVersionByParsed)(parsedObject) > 0;
}
exports.isYarnLockParsed = isYarnLockParsed;
function assertYarnLockParsed(parsedObject) {
    if (!(0, detect_yarnlock_version_1.detectYarnLockVersionByParsed)(parsedObject)) {
        throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
}
exports.assertYarnLockParsed = assertYarnLockParsed;
function isYarnLockParsedV1(data) {
    return data.verType === yarnlock_types_1.EnumDetectYarnLock.v1;
}
exports.isYarnLockParsedV1 = isYarnLockParsedV1;
function isYarnLockParsedV2(data) {
    return data.verType === yarnlock_types_1.EnumDetectYarnLock.v2 || data.verType === yarnlock_types_1.EnumDetectYarnLock.v3;
}
exports.isYarnLockParsedV2 = isYarnLockParsedV2;
function assertYarnLockParsedIsSupported(parsedOldPackage, cb) {
    if (isYarnLockParsedV1(parsedOldPackage)) {
        return cb === null || cb === void 0 ? void 0 : cb(yarnlock_types_1.EnumDetectYarnLock.v1, parsedOldPackage);
    }
    else if (isYarnLockParsedV2(parsedOldPackage)) {
        return cb === null || cb === void 0 ? void 0 : cb(yarnlock_types_1.EnumDetectYarnLock.v3, parsedOldPackage);
    }
    throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
}
exports.assertYarnLockParsedIsSupported = assertYarnLockParsedIsSupported;
//# sourceMappingURL=index.js.map