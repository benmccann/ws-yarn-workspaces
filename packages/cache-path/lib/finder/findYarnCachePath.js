"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findYarnCachePath = void 0;
const upath2_1 = require("upath2");
const fs_extra_1 = require("fs-extra");
const cross_spawn_extra_1 = require("cross-spawn-extra");
function findYarnCachePath(cwd, processEnv = process.env) {
    try {
        let cp = cross_spawn_extra_1.sync('yarn', [
            'config',
            'current',
            '--json',
        ], {
            stripAnsi: true,
            env: processEnv,
            cwd,
        });
        let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);
        if (data.tempFolder) {
            return upath2_1.normalize(data.tempFolder);
        }
    }
    catch (e) {
    }
    if (processEnv.YARN_CACHE_FOLDER && fs_extra_1.pathExistsSync(processEnv.YARN_CACHE_FOLDER)) {
        return upath2_1.normalize(processEnv.YARN_CACHE_FOLDER);
    }
}
exports.findYarnCachePath = findYarnCachePath;
//# sourceMappingURL=findYarnCachePath.js.map