import { IWrapDedupeCache, IWrapDedupeReturnType } from '../types';
import { Arguments, Argv } from 'yargs';
import { fsYarnLockSafe } from '@yarn-tool/yarnlock-fs/lib/read';
import { yarnDedupe } from '@yarn-tool/yarnlock-dedupe/object';
import { readFileSync, writeFileSync } from 'fs-extra';
import { yarnLockDiff } from '@yarn-tool/yarnlock-diff';
import { IWrapDedupeCacheRuntime, IWrapDedupeOptions } from './types';
import { handleWrapDedupeOptions } from './handleWrapDedupeOptions';

export async function wrapDedupeAsync<T extends {
	cwd?: string,
	[k: string]: unknown,
}, U extends T | {
	cwd: string,
	[k: string]: unknown,
}, C extends IWrapDedupeCache>(yarg: Argv<T>, argv: Arguments<U>, options: IWrapDedupeOptions<T, U, C>): Promise<IWrapDedupeReturnType<T, U, C>>
{
	let cache: IWrapDedupeCacheRuntime;

	({
		options,
		cache,
	} = handleWrapDedupeOptions<T, U, C>(yarg, argv, options));

	const { consoleDebug } = options;

	let { init, before, main, after, end } = options;

	LABEL1: {

		cache.ret.init = init ? !!await init(yarg, argv, cache as any) : null;

		if (cache.ret.init)
		{
			break LABEL1;
		}

		cache.ret.before = before ? !!await before(yarg, argv, cache as any) : null;
		if (cache.ret.before)
		{
			break LABEL1;
		}

		cache.yarnlock_cache = fsYarnLockSafe(cache.rootData.root);

		if (cache.yarnlock_cache.yarnlock_exists)
		{
			let ret1 = await yarnDedupe(cache.yarnlock_cache.yarnlock_old);

			if (ret1.yarnlock_changed)
			{
				writeFileSync(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);

				let msg = yarnLockDiff(ret1.yarnlock_old, ret1.yarnlock_new);

				if (msg)
				{
					cache.yarnlock_msg = msg;
				}

				cache.yarnlock_changed = true;

				cache.yarnlock_cache.yarnlock_old = ret1.yarnlock_new;

				consoleDebug?.info(`Deduplication yarn.lock`);
				consoleDebug?.gray.info(`${cache.yarnlock_cache.yarnlock_file}`);
			}
		}

		cache.ret.main = !!await main(yarg, argv, cache as any);
		if (cache.ret.main)
		{
			break LABEL1;
		}

		cache.yarnlock_cache = fsYarnLockSafe(cache.rootData.root);

		if (cache.yarnlock_cache.yarnlock_exists)
		{
			let ret1 = yarnDedupe(cache.yarnlock_cache.yarnlock_old);

			if (ret1.yarnlock_changed)
			{
				if (cache.yarnlock_old2 == null)
				{
					cache.yarnlock_old2 = ret1.yarnlock_old;
				}

				writeFileSync(cache.yarnlock_cache.yarnlock_file, ret1.yarnlock_new);

				let msg = yarnLockDiff(ret1.yarnlock_old, ret1.yarnlock_new);

				if (msg)
				{
					cache.yarnlock_msg = msg;
				}

				cache.yarnlock_changed = true;

				cache.yarnlock_cache.yarnlock_old = ret1.yarnlock_new;

				consoleDebug?.info(`Deduplication yarn.lock`);
				consoleDebug?.gray.info(`${cache.yarnlock_cache.yarnlock_file}`);
			}
			else if (cache.yarnlock_changed == null)
			{
				cache.yarnlock_changed = ret1.yarnlock_changed;
			}
		}

		if (cache.yarnlock_changed)
		{
			if (!cache.yarnlock_cache.yarnlock_exists || !cache.yarnlock_old || cache.yarnlock_old == cache.yarnlock_cache.yarnlock_old)
			{
				cache.yarnlock_changed = false;
			}
		}

		// @ts-ignore
		cache.ret.after = after ? !!await after(yarg, argv, cache) : null;
		if (cache.ret.after)
		{
			break LABEL1;
		}

		cache.yarnlock_cache = fsYarnLockSafe(cache.rootData.root);

		if (cache.yarnlock_cache.yarnlock_exists)
		{
			if (cache.yarnlock_changed)
			{
				let msg = yarnLockDiff(cache.yarnlock_old || cache.yarnlock_old2, cache.yarnlock_cache.yarnlock_old);

				if (msg)
				{
					cache.yarnlock_msg = msg;
				}
			}
			else
			{
				let yarnlock_now = readFileSync(cache.yarnlock_cache.yarnlock_file).toString();
				let yarnlock_old2 = cache.yarnlock_old || cache.yarnlock_old2;

				if (yarnlock_old2)
				{
					let msg = yarnLockDiff(yarnlock_old2, yarnlock_now);

					if (msg)
					{
						cache.yarnlock_msg = msg;

						cache.yarnlock_changed = true;
					}
				}
			}
		}
	}

	// @ts-ignore
	cache.ret.end = end ? !!await end(yarg, argv, cache) : null;

	return {
		cwd: cache.cwd,
		rootData: cache.rootData,
		yarg,
		argv,
		// @ts-ignore
		cache,
	}
}
