/**
 * Created by user on 2020/6/5.
 */
import { wsFindPackageHasModules } from '@yarn-tool/node-modules';
import { wsPkgListable } from 'ws-pkg-list/lib/listable';
import { wsFindPackageHasModulesCore } from '@yarn-tool/node-modules/lib/ws-find-paths';
import { IListableRow } from 'ws-pkg-list';
import yarnListLink from 'yarn-list-link/core';
import { linkSync, realpathSync, removeSync } from 'fs-extra';
import crossSpawn from 'cross-spawn-extra';
import { unlinkSync } from 'fs';
import { sameRealpath, isSymbolicLink } from './lib/util';

export function fixYarnWorkspaceLinks(cwd?: string, options?: {
	dir?: string,
	verbose?: boolean,
})
{
	let listable = wsPkgListable(cwd);
	let links = yarnListLink(cwd) || [];

	let pkgs = listable
		.reduce((a, b) =>
		{

			a[b.name] = b;

			return a
		}, {} as Record<string, IListableRow>)
	;

	let sublist = wsFindPackageHasModulesCore(listable, options?.dir)

	let verbose = options?.verbose;

	if (sublist.length)
	{

		sublist
			.forEach(data =>
			{
				let _error: boolean;

				verbose && console.debug(`check`, data.name, `=>`, data.location);

				let add_links = [] as string[];

				data.modules.forEach(row =>
				{

					let name = row.name;
					let location = pkgs[name]?.location;

					let is_same = sameRealpath(location, row.location)

					if (location && is_same === false && !isSymbolicLink(row.location))
					{
						console.log(`create link`, row.name, `=>`, location)

						try
						{
							unlinkSync(row.location);
							linkSync(location, row.location);
						}
						catch (e)
						{
							verbose && console.error(e.toString());
							_error = true;

							if (links.includes(name))
							{
								add_links.push(name)
							}
						}
					}
					else if (links.includes(name))
					{
						add_links.push(name)
					}
					else if (typeof is_same === 'undefined')
					{
						_error = true;
					}

				})
				;

				if (add_links.length)
				{
					crossSpawn.sync('yarn', [
						`link`,
						...add_links,
					], {
						cwd: data.location,
						stdio: 'inherit',
					})
				}

				if (_error)
				{
					verbose && console.debug(`try use fallback`);

					crossSpawn.sync('yarn', [], {
						cwd: data.location,
						stdio: 'inherit',
					})
				}

			})
		;
	}
	else
	{
		verbose && console.debug(`no exists sub package has modules with sub install`);
	}
}

export default fixYarnWorkspaceLinks

