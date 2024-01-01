/**
 * Class utilities.
 */

import '#@initialize.ts';

/**
 * Defines types/exports.
 *
 * @note Types are re-exported by `$type`.
 */
export type ObjTagSymbolFn = () => string;
export type ObjStringTagSymbolFn = () => string;

export type objFreezeClonesSymbolFn = () => boolean;
export type objDeepFreezeClonesSymbolFn = () => boolean;

export type ObjToPlainSymbolFn = () => object;
export type ObjToEqualsSymbolFn = () => object;
export type ObjToJSONSymbolFn = () => unknown;
export { type ToCloneSymbolFn as ObjToCloneSymbolFn } from '#obj.ts';

export { getClass as getBase, type Class as Base } from '#@classes/base.ts';
export { getClass as getBrand, type Class as Brand, type RawProps as BrandRawProps } from '#@classes/brand.ts';
export { getClass as getFetcher, type Class as Fetcher } from '#@classes/fetcher.ts';
export { getClass as getLogger, type Class as Logger, type Interface as LoggerInterface } from '#@classes/logger.ts';
export { getClass as getObjMC, type Class as ObjMC, type Handler as ObjMCHandler } from '#@classes/obj-mc.ts';
export { getClass as getPerson, type Class as Person, type RawProps as PersonRawProps } from '#@classes/person.ts';
export { getClass as getUtility, type Class as Utility } from '#@classes/utility.ts';
