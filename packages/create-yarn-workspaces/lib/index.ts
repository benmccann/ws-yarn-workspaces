import { IPackageJson } from '@ts-type/package-dts/package-json';

export function getDefaultPackageJson(name?: string): IPackageJson
{
	return (<IPackageJson>{
		"name": name,
		"version": "1.0.0",
		"private": true,
		"workspaces": [
			"packages/*",
		],
		keywords: [],
		"scripts": {
			"preversion": "echo preversion",
			"lerna:publish": "yarn run prepublishOnly && lerna publish && yarn run postpublishOnly",
			"lerna:publish:yes": "yarn run prepublishOnly && lerna publish --yes --bump patch && yarn run postpublishOnly",
			"prepublishOnly": "yarn run prepublishOnly:check-bin && yarn run prepare:fix-ws-links",
			"prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
			"prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
			"prepare:fix-ws-links": "ynpx --quiet @yarn-tool/fix-ws-links",
			"ncu": "yarn run ncu:root && yarn run ncu:ws",
			"ncu:root": "yarn-tool ncu -- -u",
			"ncu:ws": "yarn-tool ws exec yarn-tool ncu -- -u",
			"sort-package-json": "yarn run sort-package-json:root && yarn run sort-package-json:ws",
			"sort-package-json:root": "yarn-tool sort",
			"sort-package-json:ws": "yarn-tool ws exec yarn-tool sort",
			"postpublishOnly": "echo postpublishOnly",
			"test": "yarn-tool ws run test",
		},
		"devDependencies": {
			"@bluelovers/tsconfig": "^1.0.19",
			"@types/node": "*",
		},
		"peerDependencies": {
			"lerna": "*",
			"yarn": "*",
			"ynpx": "*",
			"@bluelovers/conventional-changelog-bluelovers": "*",
		},
		"resolutions": {},
	}) as any;
}

export function getDefaultTsconfig()
{
	return {
		extends: "@bluelovers/tsconfig/esm/mapfile.json",
	}
}
