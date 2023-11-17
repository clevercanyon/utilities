/**
 * Class utilities.
 */

import './resources/init.ts';

/**
 * Defines types/exports.
 *
 * @note Types are re-exported by `$type`.
 */
export type ObjTagSymbolFn = () => string;
export type ObjStringTagSymbolFn = () => string;

export type ObjToPlainSymbolFn = () => object;
export type ObjToEqualsSymbolFn = () => object;
export type ObjToJSONSymbolFn = () => unknown;
export { type ToCloneSymbolFn as ObjToCloneSymbolFn } from './obj.ts';

export { getClass as getBase, type Class as Base } from './resources/classes/base.ts';
export { getClass as getBrand, type Class as Brand, type RawProps as BrandRawProps } from './resources/classes/brand.ts';
export { getClass as getFetcher, type Class as Fetcher } from './resources/classes/fetcher.ts';
export { getClass as getObjMC, type Class as ObjMC, type Handler as ObjMCHandler } from './resources/classes/obj-mc.ts';
export { getClass as getPerson, type Class as Person, type RawProps as PersonRawProps } from './resources/classes/person.ts';
export { getClass as getUtility, type Class as Utility } from './resources/classes/utility.ts';
