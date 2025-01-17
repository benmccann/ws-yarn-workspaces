import { IOptionsDedupe } from './lib/types';
/**
 * @deprecated
 */
export declare function listDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string[];
/**
 * @deprecated
 */
export declare function fixDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string;
/**
 * @deprecated
 */
export declare function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe): {
    yarnlock_old: string;
    yarnlock_new: string;
    yarnlock_changed: boolean;
};
/**
 * @deprecated
 */
declare const auto: {
    readonly listDuplicates: typeof listDuplicates;
    readonly fixDuplicates: typeof fixDuplicates;
    readonly yarnDedupe: typeof yarnDedupe;
};
/**
 * @deprecated
 */
export default auto;
