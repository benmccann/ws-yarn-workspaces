"use strict";
/**
 * Created by user on 2020/6/12.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSemver = exports.isUpgradeable = exports.queryRemoteVersions = exports.packageMapToKeyObject = exports.queryPackageManagersNpm = exports.getVersionTarget = exports.fetchVersion = exports.requestVersion = void 0;
const types_1 = require("./types");
const bluebird_1 = __importDefault(require("bluebird"));
const store_1 = require("./store");
const package_json_1 = __importDefault(require("package-json"));
const versionmanager_1 = require("npm-check-updates/lib/versionmanager");
const semver_1 = __importDefault(require("semver"));
const util_1 = require("./util");
const npm_1 = __importDefault(require("npm-check-updates/lib/package-managers/npm"));
const options_1 = require("./options");
function requestVersion(packageName) {
    return bluebird_1.default
        .resolve(store_1.remoteCacheMap.get(packageName))
        .then(function (result) {
        if (result == null) {
            return package_json_1.default(packageName, { allVersions: true });
        }
        return result;
    })
        .tap(function (result) {
        return store_1.remoteCacheMap.set(packageName, result);
    });
}
exports.requestVersion = requestVersion;
function fetchVersion(packageName, options = {}, ncuOptions) {
    let { field = 'versions' } = options;
    return requestVersion(packageName)
        //.resolve(packageJson(packageName, { allVersions: true }))
        .then(function (result) {
        if (field.startsWith('dist-tags.')) {
            const split = field.split('.');
            if (result[split[0]]) {
                return result[split[0]][split[1]];
            }
        }
        else if (field === 'versions') {
            return Object.keys(result[field]);
        }
        else if (field) {
            return result[field];
        }
    })
        .then(result => {
        if (options.filter) {
            return result.filter(options.filter);
        }
        //console.dir(result);
        return result;
    });
}
exports.fetchVersion = fetchVersion;
function getVersionTarget(options) {
    if (typeof options === 'string') {
        // @ts-ignore
        return options;
    }
    else if (options.versionTarget) {
        return options.versionTarget;
    }
    return versionmanager_1.getVersionTarget(options);
}
exports.getVersionTarget = getVersionTarget;
function queryPackageManagersNpm(name, version = '0', versionTarget = types_1.EnumVersionValue.latest) {
    let method = types_1.EnumPackageManagersNpmMethod[versionTarget];
    if (version == null) {
        version = '0';
        switch (versionTarget) {
            case types_1.EnumVersionValue.latest:
            case types_1.EnumVersionValue.greatest:
            case types_1.EnumVersionValue.newest:
                break;
            case types_1.EnumVersionValue.major:
            case types_1.EnumVersionValue.minor:
                method = types_1.EnumPackageManagersNpmMethod.latest;
                break;
        }
    }
    return bluebird_1.default
        .resolve(npm_1.default[method](name, version, {}))
        .then(async (value) => {
        if (value == null) {
            let r = await requestVersion(name);
            if (version in r['dist-tags']) {
                return r['dist-tags'][version];
            }
        }
        return value;
    });
}
exports.queryPackageManagersNpm = queryPackageManagersNpm;
function packageMapToKeyObject(packageMap, versionTarget) {
    return Object
        .entries(packageMap)
        .map(([name, version_old]) => {
        return store_1.objVersionCache({
            name, version_old, versionTarget,
        });
    });
}
exports.packageMapToKeyObject = packageMapToKeyObject;
function queryRemoteVersions(packageMap, options = {}) {
    return bluebird_1.default.resolve()
        .then(async function () {
        options = options_1.npmCheckUpdatesOptions(options);
        //console.dir(options);
        options.loglevel = 'silent';
        let versionTarget = options.versionTarget = getVersionTarget(options) || types_1.EnumVersionValue.latest;
        if (Array.isArray(packageMap)) {
            packageMap = packageMap.reduce(function (a, b) {
                a[b] = versionTarget;
                return a;
            }, {});
        }
        let packageMapArray = packageMapToKeyObject(packageMap, versionTarget);
        let packageMapArrayFilted = await bluebird_1.default.resolve(packageMapArray)
            .filter(async (d) => {
            let bool = !store_1.hasQueryedVersionCache(d);
            if (bool && util_1.isBadVersion(d.version_old)) {
                if (versionTarget === types_1.EnumVersionValue.minor) {
                    let version_new = await queryPackageManagersNpm(d.name);
                    d.version_old = version_new.split('.')[0] + '.0.0';
                    store_1.setVersionCacheMap({
                        ...d,
                        version_new,
                    });
                    bool = false;
                }
            }
            return bool;
        });
        let packageMap2 = util_1.keyObjectToPackageMap(packageMapArrayFilted);
        return bluebird_1.default
            .resolve(versionmanager_1.queryVersions(packageMap2, options))
            .tap(ret => {
            return bluebird_1.default.resolve(Object.entries(packageMap2))
                .each(async ([name, version_old]) => {
                let version_new = ret[name];
                if (version_old.includes('~')) {
                    if (!options.noSafe || version_new == null) {
                        version_new = await fetchVersion(name, {
                            filter(version) {
                                return semver_1.default.satisfies(version, version_old);
                            },
                        }, options)
                            .then(ret => ret.pop());
                    }
                }
                if (version_new == null && util_1.isBadVersion(version_old)) {
                    version_new = await queryPackageManagersNpm(name, null, versionTarget);
                }
                if (version_new == null) {
                    version_new = await queryPackageManagersNpm(name, version_old, versionTarget);
                }
                store_1.setVersionCacheMap({
                    name,
                    versionTarget,
                    version_old,
                    version_new,
                });
            });
        })
            .then(() => {
            return packageMapArray
                .map(data => store_1.versionCacheMap.get(store_1.strVersionCache(data)));
        });
    });
}
exports.queryRemoteVersions = queryRemoteVersions;
function isUpgradeable(current, latest) {
    return versionmanager_1.isUpgradeable(current, latest);
}
exports.isUpgradeable = isUpgradeable;
function updateSemver(current, latest, options = {}) {
    return versionmanager_1.upgradeDependencyDeclaration(current, latest, options);
}
exports.updateSemver = updateSemver;
//# sourceMappingURL=remote.js.map