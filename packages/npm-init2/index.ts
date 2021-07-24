#!/usr/bin/env node

import findYarnWorkspaceRoot from 'find-yarn-workspace-root2';
import yargs from 'yargs';
import crossSpawn from 'cross-spawn-extra';
import { ensureDirSync, CopyOptionsSync, copySync, pathExistsSync, outputJSON, outputJSONSync } from 'fs-extra';
import { resolve, join, relative } from 'upath2';
import getConfig, { parseStaticPackagesPaths } from 'workspaces-config';
import PackageJsonLoader from 'npm-package-json-loader';
import { IPackageJson } from '@ts-type/package-dts';
import { updateNotifier } from '@yarn-tool/update-notifier';
import pkg = require( './package.json' );
import setupToYargs from './lib/yargs-setting';
import { findRoot } from '@yarn-tool/find-root';
import { npmHostedGitInfo } from '@yarn-tool/pkg-git-info';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import lodashTemplate from 'lodash/template';
import { writeReadme } from './lib/writeReadme';
import sortPackageJsonScripts from 'sort-package-json-scripts';
import WorkspacesProject from '@yarn-tool/workspaces-project';
import { parse } from 'upath2';
import pathIsSame from 'path-is-same';
import linkToNodeModules from '@yarn-tool/node-modules-link';
import { getTargetDir } from '@yarn-tool/init-path';
import { basename } from 'path';
import { isBuiltinModule } from '@yarn-tool/is-builtin-module';
import { initWithPreserveDeps } from './lib/initWithPreserveDeps';
import { IStaticFilesMapArray } from '@yarn-tool/static-file/lib/types';
import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from '@yarn-tool/static-file/lib/const';
import { copyStaticFiles } from '@yarn-tool/static-file';
import console from 'debug-color2/logger';
import { nameExistsInWorkspaces } from 'ws-pkg-list/lib/nameExistsInWorkspaces';

//updateNotifier(__dirname);

// avoid buf for idea
console.length;

let cli = setupToYargs(yargs);

let argv = cli.argv._;

//console.dir(cli.argv);

let cwd = resolve(cli.argv.cwd || process.cwd());

let rootData = findRoot({
	cwd,
	skipCheckWorkspace: cli.argv.skipCheckWorkspace,
});

let workspacePrefix: string;
let workspacesConfig: ReturnType<typeof parseStaticPackagesPaths>

let wsProject: WorkspacesProject;

if (rootData?.hasWorkspace)
{
	workspacesConfig = parseStaticPackagesPaths(getConfig(rootData.ws));

	if (workspacesConfig.prefix.length)
	{
		workspacePrefix = workspacesConfig.prefix[0];
	}

	wsProject = new WorkspacesProject(rootData.ws)
}

let { targetDir, targetName, scopedPackagePattern } = getTargetDir({
	// @ts-ignore
	inputName: argv.length && argv[0],
	cwd,
	targetName: cli.argv.name || null,
	hasWorkspace: rootData?.ws,
	workspacePrefix,
	workspacesConfig,
});

ensureDirSync(targetDir);

let flags = Object.keys(cli.argv)
	.reduce(function (a, f)
	{
		if (f === 'silent' || f === 'y' || f === 'yes')
		{

		}
		else if (/^[a-z]$/.test(f) && cli.argv[f])
		{
			a.push(f);
		}

		return a;
	}, [])
	.join('')
;

let args = [
	'init',
	(flags && '-' + flags),
	cli.argv.createModule,
	cli.argv.yes && '-y',
].filter(v => v);

//console.log(args);

const pkg_file_path = join(targetDir, 'package.json');

let old_pkg_name: string;
const oldExists = existsSync(pkg_file_path);
let old_pkg: IPackageJson;

if (oldExists && targetName?.length)
{
	console.error(`對於已存在的 Package 而言，禁止同時指定名稱`, targetName);
	console.error(pkg_file_path);
	process.exit(1);
}

if (!oldExists && rootData?.hasWorkspace)
{
	if (nameExistsInWorkspaces(targetName))
	{
		console.error(`root:`, rootData.root)
		console.error(`目標名稱已存在於 Workspaces 內，請更換名稱:`, targetName);
		process.exit(1);
	}
}

if (!oldExists && targetName && scopedPackagePattern && isBuiltinModule(basename(targetDir)))
{
	outputJSONSync(pkg_file_path, {
		name: targetName,
	}, {
		spaces: 2,
	})
}
else if (!targetName)
{
	try
	{
		old_pkg = new PackageJsonLoader(pkg_file_path)?.data;

		old_pkg_name = old_pkg.name
	}
	catch (e)
	{

	}
}

let { cp } = initWithPreserveDeps({
	npmClient: cli.argv.npmClient,
	args,
	cwd: targetDir,
	old_pkg,
	pkg_file_path,
});

if (!cp.error)
{
	rootData = findRoot({
		cwd: targetDir,
		skipCheckWorkspace: cli.argv.skipCheckWorkspace,
	});

	if (!rootData?.root)
	{
		console.error(`發生錯誤，初始化失敗`, targetName);
		console.error(targetDir);
		process.exit(1);
	}

	let pkg = new PackageJsonLoader(pkg_file_path);

	if (pkg.exists())
	{
		if (cli.argv.p && cli.argv.npmClient !== 'yarn')
		{
			pkg.data.private = true;
		}

		// 防止 node- 被 npm 移除
		if (!cli.argv.yes && old_pkg_name && /^node-/.test(old_pkg_name) && ('node-' + pkg.data.name) === old_pkg_name)
		{
			pkg.data.name = old_pkg_name;
		}
		else if (cli.argv.yes && old_pkg_name && pkg.data.name !== old_pkg_name)
		{
			pkg.data.name = old_pkg_name;
		}
		else if (targetName && pkg.data.name !== targetName)
		{
			pkg.data.name = targetName;
		}

		if (pkg.data.name && /^@/.test(pkg.data.name) && !pkg.data.publishConfig)
		{
			//pkg.data.publishConfig = {};
		}

		if (!pkg.data.scripts)
		{
			pkg.data.scripts = {};
		}

		if (!pkg.data.homepage || !pkg.data.bugs || !pkg.data.repository)
		{
			try
			{
				let info = npmHostedGitInfo(targetDir);

				// @ts-ignore
				pkg.data.homepage = pkg.data.homepage || info.homepage

				if (rootData.hasWorkspace)
				{
					let u = new URL(pkg.data.homepage as string);

					u.pathname += '/tree/master/' + relative(rootData.ws, targetDir);

					// @ts-ignore
					pkg.data.homepage = u.toString();
				}

				pkg.data.bugs = pkg.data.bugs || {
					url: info.bugs,
				}

				pkg.data.repository = pkg.data.repository || {
					"type": "git",
					url: info.repository,
				}
			}
			catch (e)
			{

			}
		}

		let sharedScript: IPackageJson['scripts'] = {
			"prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
			"prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
			"ncu": "yarn-tool ncu -u",
			"sort-package-json": "yarn-tool sort",
			"test": `echo "Error: no test specified"`,
		}

		let preScripts: string[] = ["echo preversion"];

		if (rootData.isRoot || rootData.hasWorkspace && !wsProject.manifest.scripts?.['prepublishOnly:check-bin'])
		{
			preScripts.push('yarn run prepublishOnly:check-bin');
		}

		if (rootData.isRoot && !rootData.isWorkspace)
		{
			sharedScript.prepublishOnly = "yarn run preversion"
		}

		if (rootData.hasWorkspace)
		{

		}
		else if (rootData.isRoot)
		{
			sharedScript = {
				...sharedScript,
				"npm:publish": "npm publish",
				"npm:publish:bump": "yarn-tool version && npm publish",
				"postpublish:git:commit": `git commit -m "chore(release): publish" . & echo postpublish:git:commit`,
				"postpublish:git:tag": `ynpx --quiet @yarn-tool/tag`,
				"postpublish:changelog": `ynpx --quiet @yarn-tool/changelog && git add ./CHANGELOG.md`,
				"postpublish:git:push": `git push --follow-tags`,
				"postpublish": `yarn run postpublish:changelog && yarn run postpublish:git:commit && yarn run postpublish:git:tag && yarn run postpublish:git:push`,

			}

			if (!oldExists)
			{
				sharedScript = {
					...sharedScript,
					"tsc:default": "tsc -p tsconfig.json",
					"tsc:esm": "tsc -p tsconfig.esm.json",
				}
			}
		}

		if (!oldExists)
		{
			sharedScript.coverage = "yarn run test -- --coverage"
		}

		preScripts.push("yarn run test");
		sharedScript.preversion = preScripts.join(' && ')

		pkg.data.scripts ??= {};

		if (!oldExists)
		{
			if (pkg.data.scripts?.test === "echo \"Error: no test specified\" && exit 1" && sharedScript.test?.length > 0)
			{
				delete pkg.data.scripts.test
			}

			Object
				.entries({
					"test:mocha": "ynpx --quiet -p ts-node -p mocha mocha -- --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",
					"test:jest": "jest --passWithNoTests",
					"lint": "ynpx --quiet eslint -- **/*.ts",

					...sharedScript,
				})
				.forEach(([k, v]) =>
				{
					if (pkg.data.scripts[k] == null)
					{
						pkg.data.scripts[k] = v;
					}
				})
			;
		}
		else
		{
			Object
				.entries(sharedScript)
				.forEach(([k, v]) =>
				{
					if (k.endsWith('_') && pkg.data.scripts[k.replace(/_+$/, '')] === v)
					{
						return;
					}

					if (pkg.data.scripts[k] == null)
					{
						pkg.data.scripts[k] = v;
					}
				})
			;

			if (!pkg.data.types || !pkg.data.typings)
			{
				pkg.data.types = pkg.data.types || pkg.data.typings;

				if (pkg.data.main && !pkg.data.types)
				{
					let file = join(targetDir, pkg.data.main)
					let parsed = parse(file);

					if (!pathIsSame(targetDir, parsed.dir) && pathExistsSync(join(parsed.dir, parsed.name + '.d.ts')))
					{
						pkg.data.types = relative(targetDir, parsed.dir).replace(/^\.\//, '') + '/' + parsed.name + '.d.ts'
					}
				}

				pkg.data.typings = pkg.data.types;
			}

			if (old_pkg)
			{
				Object.keys(old_pkg)
					.forEach(key =>
					{
						if (!(key in pkg.data))
						{
							pkg.data[key] = old_pkg[key];
						}

					})
				;
			}
		}

		/*
		console.dir({
			sharedScript,
			scripts: pkg.data.scripts,
			oldExists,
			rootData,
			preScripts,
		})
		 */

		if (!oldExists)
		{
			const cpkg = require('./package.json') as IPackageJson;

			const findVersion = (name: string) =>
			{
				return cpkg.dependencies?.[name] || cpkg.devDependencies?.[name] || cpkg.peerDependencies?.[name] || "*"
			};

			pkg.data.dependencies = pkg.data.dependencies || {};
			pkg.data.devDependencies = pkg.data.devDependencies || {};
			pkg.data.peerDependencies = pkg.data.peerDependencies || {};

			if (rootData.isRoot)
			{
				pkg.data.devDependencies['@bluelovers/tsconfig'] = findVersion('@bluelovers/tsconfig');
				pkg.data.devDependencies['@types/node'] = findVersion('@types/node');
			}

			pkg.data.dependencies['tslib'] = findVersion('tslib');
		}

		if (wsProject && !rootData.isWorkspace)
		{
			const rootKeywords = wsProject.manifest.toJSON().keywords;

			if (!pkg.data.keywords?.length && rootKeywords?.length)
			{
				pkg.data.keywords = rootKeywords.slice()
			}
		}

		pkg.data.scripts = sortPackageJsonScripts(pkg.data.scripts);

		pkg.autofix();

		if (cli.argv.sort)
		{
			pkg.sort();
		}

		pkg.writeOnlyWhenLoaded();

		/*
		try
		{
			let copyOptions: CopyOptionsSync = {
				overwrite: false,
				preserveTimestamps: true,
				errorOnExist: false,
			};

			copySync(join(__dirname, 'lib/static'), targetDir, copyOptions);
		}
		catch (e)
		{

		}
		 */

		let mdFile = join(targetDir, 'README.md');

		let existsReadme = !oldExists || !existsSync(mdFile);

		let file_map: IStaticFilesMapArray<string> = [
			...defaultCopyStaticFiles,
		]

		if (!wsProject)
		{
			file_map = [
				...defaultCopyStaticFilesRootOnly,
				...file_map,
			];
		}

		copyStaticFiles({
			cwd: targetDir,
			file_map,
		})

		if (existsReadme)
		{
			writeReadme({
				file: join(targetDir, 'README.md'),
				variable: pkg.data,
			})
		}

		if (wsProject && !rootData.isWorkspace)
		{
			linkToNodeModules({
				cwd: targetDir,
				sourcePackagePath: targetDir,
			})
		}

		/*
		fs.copySync(path.join(__dirname, 'lib/file/npmignore'), path.join(targetDir, '.npmignore'), copyOptions);

		fs.copySync(path.join(__dirname, 'lib/file/gitignore'), path.join(targetDir, '.gitignore'), copyOptions);

		if (!fs.pathExistsSync(path.join(targetDir, 'tsconfig.json')))
		{
			fs.copySync(path.join(__dirname, 'lib/file/tsconfig.json.tpl'), path.join(targetDir, 'tsconfig.json.tpl'), copyOptions);
		}
		 */

	}
}
else
{
	process.exitCode = 1;
}
