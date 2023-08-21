/**
 * Object MC class.
 */

import {
	tag as $objꓺtag, //
	clone as $objꓺclone,
	hasOwn as $objꓺhasOwn,
	cloneDeep as $objꓺcloneDeep,
	keysAndSymbols as $objꓺkeysAndSymbols,
} from '../../obj.js';

import {
	has as $obpꓺhas, //
	get as $obpꓺget,
	set as $obpꓺset,
	unset as $obpꓺunset,
	leave as $obpꓺleave,
	defaultTo as $obpꓺdefaultTo,
} from '../../obp.js';

import {
	map as $isꓺmap, //
	array as $isꓺarray,
	string as $isꓺstring,
	object as $isꓺobject,
	function as $isꓺfunction,
	deepEqual as $isꓺdeepEqual,
	safeObjectPath as $isꓺsafeObjectPath,
} from '../../is.js';

import { flatObject as $toꓺflatObject } from '../../to.js';
import { getClass as $classꓺgetUtility } from './utility.js';

import type * as $type from '../../type.js';
import type { Interface as $classꓺUtilityInterface } from './utility.js';

let Class: Constructor; // Class definition cache.

/**
 * Defines types.
 */
export type Constructor = {
	new (): Interface;
};
export type Interface = $classꓺUtilityInterface & {
	newInstance(): Interface;

	readonly kinds: {
		MERGE_DEEP: Kind;
		MERGE_CLONES_DEEP: Kind;

		PATCH_DEEP: Kind;
		PATCH_CLONES_DEEP: Kind;

		UPDATE_DEEP: Kind;
		UPDATE_CLONES_DEEP: Kind;
	};
	readonly mergeDeep: Handler;
	readonly mergeClonesDeep: Handler;

	readonly patchDeep: Handler;
	readonly patchClonesDeep: Handler;

	readonly updateDeep: Handler;
	readonly updateClonesDeep: Handler;

	addMerge(tagA: string, tagB: string, callback: MergeCallback): MergeCallback | undefined;
	addOperation(name: string, callback: OperationCallback): OperationCallback | undefined;
};
export type Kind = 'mergeDeep' | 'mergeClonesDeep' | 'patchDeep' | 'patchClonesDeep' | 'updateDeep' | 'updateClonesDeep';
export type CircularMap = Map<unknown, Map<unknown, unknown>> & { [x: symbol]: boolean };

export type Handler = {
	<TypeA extends undefined, TypeB extends object>(...args: [TypeA, TypeB]): TypeB;
	<TypeA extends object, TypeB extends undefined>(...args: [TypeA, TypeB]): TypeA;

	<TypeA extends object, TypeB extends object>(...args: [TypeA, TypeB]): //
	Record<keyof TypeA | keyof TypeB, $type.Object>;

	<TypeA extends object, TypeB extends object, TypeC extends object>(...args: [TypeA, TypeB, TypeC]): //
	Record<keyof TypeA | keyof TypeB | keyof TypeC, $type.Object>;

	<TypeA extends object, TypeB extends object, TypeC extends object, TypeD extends object>(...args: [TypeA, TypeB, TypeC, TypeD]): //
	Record<keyof TypeA | keyof TypeB | keyof TypeC | keyof TypeD, $type.Object>;

	<TypeA extends object, TypeB extends object, TypeC extends object, TypeD extends object, TypeE extends object>(...args: [TypeA, TypeB, TypeC, TypeD, TypeE]): //
	Record<keyof TypeA | keyof TypeB | keyof TypeC | keyof TypeD | keyof TypeE, $type.Object>;

	(...args: unknown[]): unknown;
};
export type MergeCallback = {
	(a: unknown, b: unknown, kind: Kind, circular: CircularMap): unknown;
};
export type OperationCallback = {
	(target: unknown, params: unknown, separator?: string, calledAs?: string): boolean;
};

/**
 * Object MC class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
	if (Class) return Class;

	Class = class extends $classꓺgetUtility() implements Interface {
		/**
		 * Public API. ---
		 */

		/**
		 * Defines merge kinds.
		 */
		public readonly kinds: {
			MERGE_DEEP: Kind;
			MERGE_CLONES_DEEP: Kind;

			PATCH_DEEP: Kind;
			PATCH_CLONES_DEEP: Kind;

			UPDATE_DEEP: Kind;
			UPDATE_CLONES_DEEP: Kind;
		};

		/**
		 * Declares merge handlers.
		 */
		public readonly mergeDeep: Handler;
		public readonly mergeClonesDeep: Handler;

		public readonly patchDeep: Handler;
		public readonly patchClonesDeep: Handler;

		public readonly updateDeep: Handler;
		public readonly updateClonesDeep: Handler;

		/**
		 * Object constructor.
		 */
		public constructor() {
			super(); // Parent constructor.

			/**
			 * This class has no enumerable keys and therefore nothing is enumerated by parent constructor or by any
			 * cloning functions. Instead, we set the following keys explicitly on instantiation.
			 *
			 * Anything else added with `addMerge()` or `addOperation()` will be transferred by reference when cloning.
			 * Those add callbacks, which are not cloneable, and thus transferred by reference.
			 */
			this.kinds = {
				MERGE_DEEP: 'mergeDeep',
				MERGE_CLONES_DEEP: 'mergeClonesDeep',

				PATCH_DEEP: 'patchDeep',
				PATCH_CLONES_DEEP: 'patchClonesDeep',

				UPDATE_DEEP: 'updateDeep',
				UPDATE_CLONES_DEEP: 'updateClonesDeep',
			};
			this.mergeDeep = this.prepareMergeHandler(this.kinds.MERGE_DEEP);
			this.mergeClonesDeep = this.prepareMergeHandler(this.kinds.MERGE_CLONES_DEEP);

			this.patchDeep = this.prepareMergeHandler(this.kinds.PATCH_DEEP);
			this.patchClonesDeep = this.prepareMergeHandler(this.kinds.PATCH_CLONES_DEEP);

			this.updateDeep = this.prepareMergeHandler(this.kinds.UPDATE_DEEP);
			this.updateClonesDeep = this.prepareMergeHandler(this.kinds.UPDATE_CLONES_DEEP);

			for (const key of ['kinds', 'mergeDeep', 'mergeClonesDeep', 'patchDeep', 'patchClonesDeep', 'updateDeep', 'updateClonesDeep']) {
				Object.defineProperty(this, key, { ...Object.getOwnPropertyDescriptor(this, key), enumerable: false });
			}
		}

		/**
		 * Creates a new instance.
		 *
		 * @returns Newly created class instance.
		 */
		public newInstance(): Interface {
			return new Class();
		}

		/**
		 * Adds a custom merge callback.
		 *
		 * @param   tagA     Object tag A.
		 * @param   tagB     Object tag B.
		 * @param   callback Merge callback.
		 *
		 * @returns          Previous merge callback.
		 */
		public addMerge(tagA: string, tagB: string, callback: MergeCallback): MergeCallback | undefined {
			if (!tagA || !$isꓺstring(tagA)) {
				throw new Error('Invalid merge tagA.');
			}
			if (!tagB || !$isꓺstring(tagB)) {
				throw new Error('Invalid merge tagB.');
			}
			if (!$isꓺfunction(callback)) {
				throw new Error('Invalid merge callback.');
			}
			const previousCallback = this[`merge${tagA}${tagB}`];
			this[`merge${tagA}${tagB}`] = callback; // New callback.

			return previousCallback as MergeCallback | undefined;
		}

		/**
		 * Adds a custom declarative operation.
		 *
		 * @param   name     Operation `$name`, `$ꓺname`.
		 * @param   callback Operation callback.
		 *
		 * @returns          Previous operation callback.
		 */
		public addOperation(name: string, callback: OperationCallback): OperationCallback | undefined {
			if (!name || !$isꓺstring(name)) {
				throw new Error('Invalid operation name.');
			}
			if (!$isꓺfunction(callback)) {
				throw new Error('Invalid operation callback.');
			}
			if (!name.startsWith('$')) {
				name = '$' + name; // Must begin with `$`.
			}
			const previousCallback = this[`operation${name}`];
			this[`operation${name}`] = callback; // New callback.

			return previousCallback as OperationCallback | undefined;
		}

		/**
		 * Protected API. ---
		 */

		/**
		 * Prepares a merge handler.
		 *
		 * @param   kind Kind of merge.
		 *
		 * @returns      Merge handler function.
		 */
		protected prepareMergeHandler(kind: Kind): Handler {
			const circularMap: unique symbol = Symbol(kind + ':circularMap');

			return function (this: Interface, ...args: Parameters<Handler>): ReturnType<Handler> {
				let circular: CircularMap; // Possibly extracted from args.
				const lastArg = args.at(-1); // Examined below.

				if ($isꓺmap(lastArg) && $objꓺhasOwn(lastArg, circularMap)) {
					circular = args.pop() as CircularMap;
				} else {
					circular = new Map() as CircularMap;
					circular[circularMap] = true; // Identifying symbol.
				}
				return args.reduce((a: unknown, b: unknown): ReturnType<Handler> => {
					if (circular.has(a)) {
						if (circular.get(a)?.has(b)) {
							return circular.get(a)?.get(b);
						}
					} /* Creates a new `a` value map. */ else {
						circular.set(a, new Map()); // Used by callbacks.
					}
					const tagA = $objꓺtag(a);
					const tabB = $objꓺtag(b);

					for (const mergeCallback of [
						`merge${tagA}${tabB}`, //
						`merge${tagA}Any`,
						`mergeAny${tabB}`,
						`mergeAnyAny`,
					]) {
						if ($isꓺfunction(this[mergeCallback])) {
							return (this[mergeCallback] as MergeCallback)(a, b, kind, circular);
						}
					}
					throw new Error('Unsupported merge.');
				});
			} as Handler;
		}

		/**
		 * Checks if a declarative operation exists.
		 *
		 * @param   name Operation `$name`, `$ꓺname` to consider.
		 *
		 * @returns      True if a declarative operation callback exists for `name`.
		 */
		protected isOperation(name: string): boolean {
			return `operation${name}` in this && $isꓺfunction(this[`operation${name}`]);
		}

		/**
		 * Performs a declarative operation.
		 *
		 * @param   target Target to operate on.
		 * @param   name   Operation `$name`, `$ꓺname`.
		 * @param   params Parameters to operation callback.
		 *
		 * @returns        True if changes occur in operation callback.
		 */
		protected performOperation(target: unknown, name: string, params: unknown) {
			if (this.isOperation(name)) {
				return (this[`operation${name}`] as OperationCallback)(target, params);
			}
			return false;
		}

		/**
		 * Extracts declarative operations.
		 *
		 * @param   value Mutated by reference.
		 *
		 * @returns       Object with declarative operations.
		 */
		protected extractOperations(value: unknown): $type.Object {
			const operations = {} as $type.Object;

			if (!$isꓺobject(value) || $isꓺarray(value)) {
				return operations; // Not possible.
			}
			for (const key of Array.from(Object.keys(value))) {
				if (this.isOperation(key)) {
					operations[key] = value[key];
					delete value[key];
				}
			}
			return operations;
		}

		/**
		 * Merges Array with Array.
		 *
		 * @param   a        Array A.
		 * @param   b        Array B.
		 * @param   kind     Merge kind.
		 * @param   circular Circular map.
		 *
		 * @returns          Merged array.
		 */
		protected mergeArrayArray(a: unknown[], b: unknown[], kind: Kind, circular: CircularMap): unknown[] {
			if ([this.kinds.PATCH_DEEP, this.kinds.PATCH_CLONES_DEEP].includes(kind)) {
				circular.get(a)?.set(b, a);

				a.splice(0, a.length); // Deletes `a` keys.

				for (let key = 0; key < b.length; key++) {
					a[key] = this[kind](undefined, b[key], circular);
				}
				return a; // Returns `a`, mutated by reference.
				//
			} else if ([this.kinds.UPDATE_DEEP, this.kinds.UPDATE_CLONES_DEEP].includes(kind) && $isꓺdeepEqual(a, b)) {
				circular.get(a)?.set(b, a);
				return a; // Returns `a` when there are no differences.
				//
			} else {
				const bClone: unknown[] = [];
				circular.get(a)?.set(b, bClone);

				for (let key = 0; key < b.length; key++) {
					bClone[key] = this[kind](undefined, b[key], circular);
				}
				return bClone; // Returns `b` clone, which replaces `a`.
			}
		}

		/**
		 * Merges Object with Object.
		 *
		 * @param   a        Object A.
		 * @param   b        Object B.
		 * @param   kind     Merge kind.
		 * @param   circular Circular map.
		 *
		 * @returns          Merged object.
		 */
		protected mergeObjectObject(a: $type.Object, b: $type.Object, kind: Kind, circular: CircularMap): $type.Object {
			const aKeys = $objꓺkeysAndSymbols(a);
			const bKeys = new Set($objꓺkeysAndSymbols(b));

			let newObj = [this.kinds.PATCH_DEEP, this.kinds.PATCH_CLONES_DEEP].includes(kind)
				? a // Patching `a` target object in this case.
				: ({} as $type.Object); // prettier-ignore

			circular.get(a)?.set(b, newObj);

			let keyResult; // For key results below.
			const operations: [string, unknown][] = [];
			let hasUpdates = ![this.kinds.UPDATE_DEEP, this.kinds.UPDATE_CLONES_DEEP].includes(kind);

			for (const key of aKeys) {
				if (bKeys.has(key) /* Have a `b` to merge in? */) {
					keyResult = this[kind](a[key], b[key], circular);
					bKeys.delete(key); // Merged this `b` key.
				} else {
					keyResult = this[kind](a[key], undefined, circular);
				}
				hasUpdates = hasUpdates || keyResult !== a[key];
				newObj[key] = keyResult; // Key assignment.
			}
			for (const key of bKeys /* Remaining `b` keys. */) {
				if ($isꓺstring(key) && this.isOperation(key)) {
					operations.push([key, b[key]]);
				} else {
					keyResult = this[kind](undefined, b[key], circular);
					hasUpdates = hasUpdates || keyResult !== a[key];
					newObj[key] = keyResult; // Key assignment.
				}
			}
			if (operations.length) {
				if ([this.kinds.UPDATE_DEEP, this.kinds.UPDATE_CLONES_DEEP].includes(kind)) {
					newObj = $objꓺcloneDeep(newObj); // Immutable; so must clone before operations.
					hasUpdates = true; // Any update with operations `hasUpdates` due to the deep clone.
				}
				for (const [operation, params] of operations) {
					hasUpdates = this.performOperation(newObj, operation, params) || hasUpdates;
				}
			}
			if ([this.kinds.PATCH_DEEP, this.kinds.PATCH_CLONES_DEEP].includes(kind)) {
				return a; // Returns `a`, mutated by reference.
			}
			if ([this.kinds.UPDATE_DEEP, this.kinds.UPDATE_CLONES_DEEP].includes(kind) && !hasUpdates) {
				return a; // Returns `a` when there are no differences.
			}
			return newObj; // Returns new object clone.
		}

		/**
		 * Merges Undefined with Array.
		 *
		 * @param   a        Undefined.
		 * @param   b        Array B.
		 * @param   kind     Merge kind.
		 * @param   circular Circular map.
		 *
		 * @returns          Merged array.
		 *
		 * @note For merges, this ultimately uses {@see mergeArrayArray()} for processing.
		 */
		protected mergeUndefinedArray(a: undefined, b: unknown[], kind: Kind, circular: CircularMap): unknown[] {
			return this[kind]([], b, circular) as unknown as unknown[];
		}

		/**
		 * Merges Array with Undefined.
		 *
		 * @param   a        Array A.
		 * @param   b        Undefined.
		 * @param   kind     Merge kind.
		 * @param   circular Circular map.
		 *
		 * @returns          Merged array.
		 *
		 * @note For merges, this ultimately uses {@see mergeArrayArray()} for processing.
		 */
		protected mergeArrayUndefined(a: unknown[], b: undefined, kind: Kind, circular: CircularMap): unknown[] {
			return this[kind](a, [...a], circular) as unknown as unknown[];
		}

		/**
		 * Merges Undefined with Object.
		 *
		 * @param   a        Undefined.
		 * @param   b        Object B.
		 * @param   kind     Merge kind.
		 * @param   circular Circular map.
		 *
		 * @returns          Merged object.
		 *
		 * @note This ultimately uses {@see mergeObjectObject()} for processing.
		 */
		protected mergeUndefinedObject(a: undefined, b: $type.Object, kind: Kind, circular: CircularMap): $type.Object {
			return this[kind]({} as $type.Object, b, circular) as $type.Object;
		}

		/**
		 * Merges Object with Undefined.
		 *
		 * @param   a        Object A.
		 * @param   b        Undefined.
		 * @param   kind     Merge kind.
		 * @param   circular Circular map.
		 *
		 * @returns          Merged object.
		 *
		 * @note This ultimately uses {@see mergeObjectObject()} for processing.
		 */
		protected mergeObjectUndefined(a: $type.Object, b: undefined, kind: Kind, circular: CircularMap): $type.Object {
			return this[kind](a, {} as $type.Object, circular) as $type.Object;
		}

		/**
		 * Merges Any with Any.
		 *
		 * @param   a        Unknown A.
		 * @param   b        Unknown B.
		 * @param   kind     Merge kind.
		 * @param   circular Circular map.
		 *
		 * @returns          Merged object.
		 */
		protected mergeAnyAny(a: unknown, b: unknown, kind: Kind, circular: CircularMap): unknown {
			const bElseA = undefined !== b ? b : a;

			if (!$isꓺobject(bElseA)) {
				circular.get(a)?.set(b, bElseA);
				return bElseA; // Merge unnecessary; i.e., primitive.
			}
			if (undefined !== b && $isꓺfunction(this['mergeUndefined' + $objꓺtag(b)])) {
				return this[kind](undefined, b, circular);
			}
			// Only create a deep clone when merging|patching clones, or when doing an immutable update.
			// Otherwise, lossless; i.e., simply transfer any unsupported object types.

			if ([this.kinds.UPDATE_DEEP, this.kinds.UPDATE_CLONES_DEEP].includes(kind) && $isꓺdeepEqual(a, b)) {
				circular.get(a)?.set(b, a);
				return a; // Returns `a` when there are no differences.
				//
			} else if ([this.kinds.MERGE_CLONES_DEEP, this.kinds.PATCH_CLONES_DEEP, this.kinds.UPDATE_DEEP, this.kinds.UPDATE_CLONES_DEEP].includes(kind)) {
				const bElseAClone = $objꓺcloneDeep(bElseA);
				circular.get(a)?.set(b, bElseAClone);
				return bElseAClone; // Returns `bElseA` deep clone, replacing `a`.
				//
			} else {
				circular.get(a)?.set(b, bElseA);
				return bElseA; // Replaces `bElseA` by reference; i.e., lossless merge.
			}
		}

		/**
		 * Performs declarative operation: `$set`, `$ꓺset`.
		 *
		 * @param   target    Target to operate on.
		 * @param   params    Parameters to operation callback.
		 * @param   separator Depending on `$name`, `$ꓺname`. Default is `.`.
		 * @param   calledAs  Internal use only. Do not pass.
		 *
		 * @returns           True if changes occur in operation callback.
		 *
		 * @note Object paths do not support symbol keys whatsoever.
		 * @note This can set own or inherited, enumerable or not, object paths.
		 */
		protected operation$set(target: unknown, params: unknown, separator: string = '.', calledAs: string = '$set') {
			if (!$isꓺobject(target)) {
				throw new Error('Invalid ' + calledAs + '. Requires object target.');
			}
			if (!$isꓺobject(params) || $isꓺarray(params)) {
				throw new Error('Invalid ' + calledAs + ' params. Expecting non-array object.');
			}
			for (const [path, value] of Object.entries(params)) {
				$obpꓺset(target, path, value, separator);
			}
			return Object.keys(params).length > 0;
		}
		protected operation$ꓺset(target: unknown, params: unknown, separator: string = 'ꓺ') {
			return this.operation$set(target, params, separator, '$ꓺset');
		}

		/**
		 * Performs declarative operation: `$unset`, `$ꓺunset`.
		 *
		 * - Aka: `$omit`, `$ꓺomit`.
		 *
		 * @param   target    Target to operate on.
		 * @param   params    Parameters to operation callback.
		 * @param   separator Depending on `$name`, `$ꓺname`. Default is `.`.
		 * @param   calledAs  Internal use only. Do not pass.
		 *
		 * @returns           True if changes occur in operation callback.
		 *
		 * @note Object paths do not support symbol keys whatsoever.
		 * @note This can unset own or inherited, enumerable or not, object paths.
		 * @note However, the use of `*` only unsets array keys and/or end-own enumerable string keys.
		 */
		protected operation$unset(target: unknown, params: unknown, separator: string = '.', calledAs: string = '$unset') {
			if (!$isꓺobject(target)) {
				throw new Error('Invalid ' + calledAs + '. Requires object target.');
			}
			if (!$isꓺarray(params)) {
				throw new Error('Invalid ' + calledAs + ' params. Expecting array.');
			}
			for (const path of params) {
				if (!$isꓺsafeObjectPath(path)) {
					throw new Error('Invalid ' + calledAs + ' param. Expecting object path.');
				}
				$obpꓺunset(target, path, separator);
			}
			return params.length > 0;
		}
		protected operation$ꓺunset(target: unknown, params: unknown, separator: string = 'ꓺ') {
			return this.operation$unset(target, params, separator, '$ꓺunset');
		}
		protected operation$omit(target: unknown, params: unknown, separator: string = '.') {
			return this.operation$unset(target, params, separator, '$omit');
		}
		protected operation$ꓺomit(target: unknown, params: unknown, separator: string = 'ꓺ') {
			return this.operation$unset(target, params, separator, '$ꓺomit');
		}

		/**
		 * Performs declarative operation: `$leave`, `$ꓺleave`.
		 *
		 * - Aka: `$pick`, `$ꓺpick`.
		 *
		 * @param   target    Target to operate on.
		 * @param   params    Parameters to operation callback.
		 * @param   separator Depending on `$name`, `$ꓺname`. Default is `.`.
		 * @param   calledAs  Internal use only. Do not pass.
		 *
		 * @returns           True if changes occur in operation callback.
		 *
		 * @note Object paths do not support symbol keys whatsoever.
		 * @note You can target (i.e., leave) own or inherited, enumerable or not, object paths; unsetting all others.
		 *       However, when unsetting all others, this only unsets array keys and/or end-own enumerable string keys.
		 *       i.e., It doesn’t unset (get rid of) end-inherited keys, non-enumerable keys, or symbol keys.
		 */
		protected operation$leave(target: unknown, params: unknown, separator = '.', calledAs: string = '$leave') {
			if (!$isꓺobject(target)) {
				throw new Error('Invalid ' + calledAs + '. Requires object target.');
			}
			if (!$isꓺarray(params)) {
				throw new Error('Invalid ' + calledAs + ' params. Expecting array.');
			}
			$obpꓺleave(target, params as $type.ObjectPath[], separator);

			return params.length > 0;
		}
		protected operation$ꓺleave(target: unknown, params: unknown, separator = 'ꓺ') {
			return this.operation$leave(target, params, separator, '$ꓺleave');
		}
		protected operation$pick(target: unknown, params: unknown, separator = '.') {
			return this.operation$leave(target, params, separator, '$pick');
		}
		protected operation$ꓺpick(target: unknown, params: unknown, separator = 'ꓺ') {
			return this.operation$leave(target, params, separator, '$ꓺpick');
		}

		/**
		 * Performs declarative operation: `$push`, `$ꓺpush`.
		 *
		 * @param   target    Target to operate on.
		 * @param   params    Parameters to operation callback.
		 * @param   separator Depending on `$name`, `$ꓺname`. Default is `.`.
		 * @param   calledAs  Internal use only. Do not pass.
		 *
		 * @returns           True if changes occur in operation callback.
		 *
		 * @note Object paths do not support symbol keys whatsoever.
		 * @note This can push onto own or inherited, enumerable or not, object paths.
		 */
		protected operation$push(target: unknown, params: unknown, separator = '.', calledAs: string = '$push') {
			if (!$isꓺobject(target)) {
				throw new Error('Invalid ' + calledAs + '. Requires object target.');
			}
			if (!$isꓺobject(params) || $isꓺarray(params)) {
				throw new Error('Invalid ' + calledAs + ' params. Expecting non-array object.');
			}
			for (const [path, value] of Object.entries(params)) {
				const array = $obpꓺget(target, path, [], separator);

				if (!$isꓺarray(array)) {
					throw new Error('Invalid ' + calledAs + '. Cannot push onto non-array value.');
				}
				array.push(value); // Onto end of stack.
				$obpꓺset(target, path, array, separator);
			}
			return Object.keys(params).length > 0;
		}
		protected operation$ꓺpush(target: unknown, params: unknown, separator = 'ꓺ') {
			return this.operation$push(target, params, separator, '$ꓺpush');
		}

		/**
		 * Performs declarative operation: `$pull`, `$ꓺpull`.
		 *
		 * @param   target    Target to operate on.
		 * @param   params    Parameters to operation callback.
		 * @param   separator Depending on `$name`, `$ꓺname`. Default is `.`.
		 * @param   calledAs  Internal use only. Do not pass.
		 *
		 * @returns           True if changes occur in operation callback.
		 *
		 * @note Object paths do not support symbol keys whatsoever.
		 * @note This can pull from own or inherited, enumerable or not, object paths.
		 */
		protected operation$pull(target: unknown, params: unknown, separator = '.', calledAs: string = '$pull') {
			if (!$isꓺobject(target)) {
				throw new Error('Invalid ' + calledAs + '. Requires object target.');
			}
			if (!$isꓺobject(params) || $isꓺarray(params)) {
				throw new Error('Invalid ' + calledAs + ' params. Expecting non-array object.');
			}
			for (const [path, value] of Object.entries(params)) {
				const array = $obpꓺget(target, path, [], separator);
				const pullValues = $isꓺarray(value) ? value : [value];

				if (!$isꓺarray(array)) {
					throw new Error('Invalid ' + calledAs + '. Cannot pull from non-array value.');
				}
				for (let key = array.length - 1; key >= 0; key--) {
					if (pullValues.includes(array[key])) {
							array.splice(key, 1); break;
						} // prettier-ignore
				}
			}
			return Object.keys(params).length > 0;
		}
		protected operation$ꓺpull(target: unknown, params: unknown, separator = 'ꓺ') {
			return this.operation$pull(target, params, separator, '$ꓺpull');
		}

		/**
		 * Performs declarative operation: `$concat`, `$ꓺconcat`.
		 *
		 * @param   target    Target to operate on.
		 * @param   params    Parameters to operation callback.
		 * @param   separator Depending on `$name`, `$ꓺname`. Default is `.`.
		 * @param   calledAs  Internal use only. Do not pass.
		 *
		 * @returns           True if changes occur in operation callback.
		 *
		 * @note Object paths do not support symbol keys whatsoever.
		 * @note This can concat onto own or inherited, enumerable or not, object paths.
		 */
		protected operation$concat(target: unknown, params: unknown, separator = '.', calledAs: string = '$concat') {
			if (!$isꓺobject(target)) {
				throw new Error('Invalid ' + calledAs + '. Requires object target.');
			}
			if (!$isꓺobject(params) || $isꓺarray(params)) {
				throw new Error('Invalid ' + calledAs + ' params. Expecting non-array object.');
			}
			for (const [path, value] of Object.entries(params)) {
				const array = $obpꓺget(target, path, [], separator);

				if (!$isꓺarray(array)) {
					throw new Error('Invalid ' + calledAs + '. Cannot concat onto non-array value.');
				}
				$obpꓺset(target, path, array.concat(value), separator);
			}
			return Object.keys(params).length > 0;
		}
		protected operation$ꓺconcat(target: unknown, params: unknown, separator = 'ꓺ') {
			return this.operation$concat(target, params, separator, '$ꓺconcat');
		}

		/**
		 * Performs declarative operation: `$default`, `$ꓺdefault`.
		 *
		 * - Aka: `$defaults`, `$ꓺdefaults`.
		 *
		 * @param   target    Target to operate on.
		 * @param   params    Parameters to operation callback.
		 * @param   separator Depending on `$name`, `$ꓺname`. Default is `.`.
		 * @param   calledAs  Internal use only. Do not pass.
		 *
		 * @returns           True if changes occur in operation callback.
		 *
		 * @note Object paths do not support symbol keys whatsoever.
		 * @note This can set own or inherited, enumerable or not, object paths.
		 */
		protected operation$default(target: unknown, params: unknown, separator = '.', calledAs: string = '$default') {
			if (!$isꓺobject(target)) {
				throw new Error('Invalid ' + calledAs + '. Requires object target.');
			}
			if (!$isꓺobject(params) || $isꓺarray(params)) {
				throw new Error('Invalid ' + calledAs + ' params. Expecting non-array object.');
			}
			for (const [path, value] of Object.entries(params)) {
				$obpꓺdefaultTo(target, path, value, separator);
			}
			return Object.keys(params).length > 0;
		}
		protected operation$ꓺdefault(target: unknown, params: unknown, separator = 'ꓺ') {
			return this.operation$default(target, params, separator, '$ꓺdefault');
		}
		protected operation$defaults(target: unknown, params: unknown, separator = '.') {
			return this.operation$default(target, params, separator, '$defaults');
		}
		protected operation$ꓺdefaults(target: unknown, params: unknown, separator = 'ꓺ') {
			return this.operation$default(target, params, separator, '$ꓺdefaults');
		}

		/**
		 * Performs declarative operation: `$keySortOrder`, `$ꓺkeySortOrder`.
		 *
		 * - Aka: `$propSortOrder`, `$ꓺpropSortOrder`.
		 *
		 * Sorts own or inherited, enumerable or not, non-numeric string keys.
		 *
		 * The final ordering of a sorted object is as follows.
		 *
		 * First, in this order:
		 *
		 * - Numeric keys are always first in ascending order. There’s no way to sort these within an object.
		 * - Inherited and non-enumerable string keys that were not targeted by `params`, in their existing and unmodified
		 *   insertion order. The only way to sort these is to explicitly target them using `params`, which effectively
		 *   changes them into own and enumerable properties, so please consider that before targeting with `params`.
		 *
		 * Next, in the sort order given:
		 *
		 * - Sorted: own or inherited, enumerable or not, non-numeric string keys in `params` order given.
		 *
		 * Last, in this order:
		 *
		 * - Unsorted own enumerable string keys. Aside from being repositioned after those explicity targeted by
		 *   `params`, their deeper ordering is preserved; i.e., as original and unmodified insertion order.
		 * - Symbol keys in their existing and unmodified insertion order. There’s no way to sort these using object
		 *   paths, which do not support symbols. Even if they did, symbol keys are always last in any object type.
		 *
		 * @param   target    Target to operate on.
		 * @param   params    Parameters to operation callback.
		 * @param   separator Depending on `$name`, `$ꓺname`. Default is `.`.
		 * @param   calledAs  Internal use only. Do not pass.
		 *
		 * @returns           True if changes occur in operation callback.
		 *
		 * @note Object paths do not support symbol keys whatsoever.
		 * @note Sorted key order matches that of `{ ...spread }` and {@see Object.keys()}.
		 */
		protected operation$keySortOrder(target: unknown, params: unknown, separator = '.', calledAs: string = '$keySortOrder') {
			if (!$isꓺobject(target)) {
				throw new Error('Invalid ' + calledAs + '. Requires object target.');
			}
			if (!$isꓺarray(params)) {
				throw new Error('Invalid ' + calledAs + ' params. Expecting array.');
			}
			/*
			 * These are flat; i.e., the deepest/longest paths possible.
			 */
			const unsortedTargetPaths: Set<$type.ObjectPath> = //
				new Set(Object.keys($toꓺflatObject(target, separator)));

			/**
			 * Clones and empties `target` to prepare for ordered reinsertions.
			 */
			const targetClone: object = $objꓺclone(target);
			$obpꓺunset(target, '*', separator);

			/*
			 * These are of any depth; i.e., shallow or deep paths targeted by `params`.
			 */
			for (const path of params) {
				if (!$isꓺsafeObjectPath(path)) {
					throw new Error('Invalid ' + calledAs + ' param. Expecting object path.');
				}
				if ($obpꓺhas(targetClone, path, separator)) {
					$obpꓺset(target, path, $obpꓺget(targetClone, path, undefined, separator), separator);
					unsortedTargetPaths.delete(path);
				}
			}
			/*
			 * Remaining unsorted flat paths; i.e., the deepest/longest paths possible, which have not been sorted already.
			 * The goal here is simply to force these to come after those which have already been sorted above.
			 *
			 * If any sorting occurred on paths that were shallower, there could be some overlap between remaining unsorted
			 * paths and those targeted by `params` above. However, the sorting of deeper paths does not conflict with the
			 * sorting of shallower paths; i.e., we're not sorting anything here that's already been sorted above.
			 */
			for (const path of unsortedTargetPaths) {
				$obpꓺset(target, path, $obpꓺget(targetClone, path, undefined, separator), separator);
			}
			return params.length > 0;
		}
		protected operation$ꓺkeySortOrder(target: unknown, params: unknown, separator = 'ꓺ') {
			return this.operation$keySortOrder(target, params, separator, '$ꓺkeySortOrder');
		}
		protected operation$propSortOrder(target: unknown, params: unknown, separator = '.') {
			return this.operation$keySortOrder(target, params, separator, '$propSortOrder');
		}
		protected operation$ꓺpropSortOrder(target: unknown, params: unknown, separator = 'ꓺ') {
			return this.operation$keySortOrder(target, params, separator, '$ꓺpropSortOrder');
		}
	};
	return Object.defineProperty(Class, 'name', {
		...Object.getOwnPropertyDescriptor(Class, 'name'),
		value: 'ObjectMC',
	});
};
