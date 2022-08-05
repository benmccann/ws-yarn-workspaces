//@noUnusedParameters:false

import { basename, extname, join } from 'path';
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { readFileSync } from 'fs';
import { checkResolutionsUpdate } from '../lib/update/checkResolutionsUpdate';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { pathExistsSync } from 'fs-extra';

beforeAll(async () =>
{

});

describe(`checkResolutionsUpdate`, () =>
{
	const dir = join(__TEST_YARNLOCK, 'ncu');

	(<(keyof typeof EnumDetectYarnLock)[]>[
		'v1',
		//'v2',
		//'v3',
	]).forEach(ver =>
	{
		const file = join(dir, ver, 'yarn.lock');

		pathExistsSync(file) && test(ver, async () =>
		{
			const name = "@types/node" as const;

			const content = readFileSync(file).toString();

			let actual = await checkResolutionsUpdate({
				[name]: "^1.0.10",
			}, content, {});

			const row = {
				name,
				version_new: expect.any(String),
			};

			console.dir(actual.deps3);
			console.dir(actual.yarnlock_changed);
			console.dir(actual.update_list);

			expect(actual).toMatchSnapshot({
				deps: [row],
				deps2: {
					[name]: row.version_new,
				},
				deps3: {
					[name]: row,
				},
				update_list: expect.any(Array),
				yarnlock_changed: expect.any(Boolean),
				yarnlock_new_obj: expect.anything(),
				yarnlock_old_obj: expect.anything(),
			});

		});
	});

})
