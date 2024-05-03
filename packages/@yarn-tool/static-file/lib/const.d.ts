import { _Key, IStaticFilesMapArray } from './types';
declare const _defaultCopyStaticFiles: readonly [readonly [".npmignore", "file/npmignore"], readonly [".gitignore", "file/gitignore"], readonly [".eslintignore", "file/eslintignore"], readonly [".nvmrc", "file/nvmrc"], readonly [".browserslistrc", "file/browserslistrc"], readonly ["tsconfig.json.tpl", "file/tsconfig.json.tpl", "tsconfig.json"], readonly ["test/tsconfig.json.tpl", "file/test/tsconfig.json.tpl", "test/tsconfig.json"], readonly ["tsconfig.esm.json.tpl", "file/tsconfig.esm.json.tpl", "tsconfig.esm.json"], readonly ["tsconfig.tsdx.json.tpl", "file/tsconfig.tsdx.json.tpl", "tsconfig.tsdx.json"], readonly [".eslintrc.json.tpl", "file/eslintrc.json.tpl", ".eslintrc.json"], readonly ["README.md", "file/README.md"], readonly [".nycrc.tpl", "file/nycrc"], readonly [".mocharc.yml.tpl", "file/mocharc.yml"], readonly ["jest.config.js", "file/jest.config.auto.js"], readonly [".nowignore", "file/nowignore"], readonly ["now.json.tpl", "file/now.json.tpl", "now.json"], readonly [".npmrc.tpl", "file/npmrc", ".npmrc"], readonly ["tsdx.config.js.tpl", "file/tsdx.config.js", "tsdx.config.js"], readonly ["tsc-multi.json.tpl", "file/tsc-multi.json.tpl", "tsc-multi.json"], readonly ["test/__root.ts", "file/test/__root.ts"], readonly ["test/fixtures/.gitkeep", "file/test/fixtures/.gitkeep"]];
declare const _defaultCopyStaticFilesRootOnly: readonly [readonly ["lerna.json.tpl", "file/lerna.json.tpl", "lerna.json"], readonly ["pnpm-workspace.yaml.tpl", "file/pnpm-workspace.yaml", "pnpm-workspace.yaml"], readonly [".github/workflows/coverage.yml", "file/github/workflows/coverage.yml"], readonly [".github/workflows/action-yarnlock-dedupe.yml", "file/github/workflows/action-yarnlock-dedupe.yml"], readonly [".github/workflows/build.yml", "file/github/workflows/build.yml"], readonly [".github/workflows/yarn-lock-changes.yml", "file/github/workflows/yarn-lock-changes.yml"], readonly [".github/commit-convention.md", "file/github/commit-convention.md"], readonly ["tsconfig.json", "file/tsconfig.json.tpl", "tsconfig.json"], readonly [".eslintrc.json", "file/eslintrc.json.tpl", ".eslintrc.json"], readonly [".yarnrc.yml.tpl", "file/root/yarnrc.yml", ".yarnrc.yml"], readonly ["jest.config.js", "file/jest.config.js"], readonly ["jest.config.js.tpl", "file/jest.config.js"], readonly ["jest.config.auto.js.tpl", "file/jest.config.auto.js"], readonly [".editorconfig.tpl", "file/tpl.editorconfig"], readonly [".editorconfig", "file/tpl.editorconfig"], readonly ["global.tsdx.d.ts", "file/root/global.tsdx.d.ts"]];
declare const _defaultCopyStaticFilesWsRootOnly: readonly [readonly ["lerna.json.tpl", "file/lerna.json.tpl"], readonly ["pnpm-workspace.yaml", "file/pnpm-workspace.yaml"], readonly ["tsconfig.json", "file/tsconfig.json.tpl"], readonly ["tsc-multi.json.tpl", "file/tsc-multi.json.tpl", "tsc-multi.json"], readonly ["__root_ws.ts", "file/ws-root/__root_ws.ts"], readonly ["jest.config.js", "file/ws-root/jest.config.js"], readonly ["jest-preset.js", "file/ws-root/jest-preset.js"], readonly [".run/lerna_publish_yes.run.xml", "file/ws-root/.run/lerna_publish_yes.run.xml"]];
export declare const defaultCopyStaticFiles: IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFiles>>;
export declare const defaultCopyStaticFilesRootOnly: IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFilesRootOnly>>;
export declare const defaultCopyStaticFilesWsRootOnly: IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFilesWsRootOnly>>;
export {};
