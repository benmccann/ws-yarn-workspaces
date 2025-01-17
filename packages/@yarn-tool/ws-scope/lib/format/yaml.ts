import { pathExistsSync, readFileSync, writeFileSync } from 'fs-extra';
import { IJsonObject, ScopeJsonObject } from './json-object';
import YAWN from 'yawn-yaml';

const SymRaw = Symbol.for('raw');

export { SymRaw }

export class ScopeYaml<K extends string = 'packages'> extends ScopeJsonObject<K>
{
	[SymRaw]: YAWN

	protected override _init()
	{
		// @ts-ignore
		this.field = this.options?.field ?? 'packages';
	}

	// @ts-ignore
	override get json()
	{
		return this[SymRaw]?.json as IJsonObject<K>;
	}

	override set json(json: IJsonObject<K>)
	{
		this[SymRaw].json = json;
	}

	override get value()
	{
		return this.json?.[this.field]
	}

	override set value(value: string[])
	{
		const json = this.json;
		json[this.field] = value;
		this.json = json;
	}

	existsFile()
	{
		return pathExistsSync(this.file)
	}

	override get opened()
	{
		return !!this[SymRaw]
	}

	loadFile(reload?: boolean)
	{
		if (reload || !this.opened)
		{
			let input = readFileSync(this.file).toString();
			let raw = new YAWN(input);
			this[SymRaw] = raw;
		}

		return this.json
	}

	saveFile()
	{
		if (this.opened)
		{
			writeFileSync(this.file, this[SymRaw].yaml)
		}
	}

	loadFileLazy(reload?: boolean)
	{
		return this.existsFile() && this.loadFile(reload)
	}

}
