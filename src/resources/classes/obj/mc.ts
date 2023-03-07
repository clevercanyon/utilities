/**
 * Utility class.
 */

import {
	array as $isꓺarray, //
	string as $isꓺstring,
	object as $isꓺobject,
	function as $isꓺfunction,
	safeObjectPath as $isꓺsafeObjectPath,
} from '../../../is.js';

import {
	tag as $objꓺtag, //
	cloneDeep as $objꓺcloneDeep,
	keysAndSymbols as $objꓺkeysAndSymbols,
} from '../../../obj.js';

import {
	has as $obpꓺhas, //
	get as $obpꓺget,
	set as $obpꓺset,
	unset as $obpꓺunset,
	defaultTo as $obpꓺdefaultTo,
	splitPath as $obpꓺsplitPath,
} from '../../../obp.js';

import $a6tꓺUtility from '../a6t/utility.js';
import type * as $type from '../../../type.js';
import { plainFlatObject as $toꓺplainFlatObject } from '../../../to.js';
import { keysNotEnumerable as $classꓺkeysNotEnumerable } from '../../../class.js';

/**
 * Defines types.
 */
export type Kind = 'merge' | 'mergeClones' | 'patch' | 'update';

export type MergeHandler = {
	<Type extends object>(this: MergeChange, ...values: Type[]): Type;

	<Type extends object>(this: MergeChange, ...values: [undefined, ...Type[]]): Type;
	<Type extends object>(this: MergeChange, ...values: [...Type[], undefined]): Type;

	<TypeA extends object, TypeB extends object>(this: MergeChange, ...values: [TypeA, ...TypeB[]]): //
	TypeB extends TypeA ? Record<keyof TypeA | keyof TypeB, $type.Object> : TypeB;

	(this: MergeChange, ...values: unknown[]): unknown;
};
export type MergeCallback = {
	<Type extends object>(this: MergeChange, a: Type, b: Type, kind: Kind): Type;

	<Type extends object>(this: MergeChange, a: undefined, b: Type, kind: Kind): Type;
	<Type extends object>(this: MergeChange, a: Type, b: undefined, kind: Kind): Type;

	<TypeA extends object, TypeB extends object>(this: MergeChange, a: TypeA, b: TypeB, kind: Kind): //
	TypeB extends TypeA ? Record<keyof TypeA | keyof TypeB, $type.Object> : TypeB;

	(this: MergeChange, a: unknown, b: unknown, kind: Kind): unknown;
};
export type OperationCallback = {
	<Type extends object>(this: MergeChange, target: Type, params: unknown, separator?: string): boolean;
	(this: MergeChange, target: unknown, params: unknown, separator?: string): boolean;
};

/**
 * Defines and exports class.
 */
@$classꓺkeysNotEnumerable(['kinds', 'merge', 'mergeClones', 'patch', 'update'])
export class MergeChange extends $a6tꓺUtility {
	/**
	 * Public API. ---
	 */

	/**
	 * Defines merge kinds.
	 */
	public readonly kinds: {
		MERGE: Kind;
		MERGE_CLONES: Kind;

		PATCH: Kind;
		UPDATE: Kind;
	};

	/**
	 * Declares merge handlers.
	 */
	public readonly merge: MergeHandler;
	public readonly mergeClones: MergeHandler;

	public readonly patch: MergeHandler;
	public readonly update: MergeHandler;

	/**
	 * Object constructor.
	 */
	public constructor() {
		super(); // Parent constructor.

		/**
		 * This class has no enumerable keys and therefore nothing is enumerated by parent constructor or by any cloning
		 * functions. Instead, we set the following keys explicitly on instantiation, and only on instantiation.
		 *
		 * Anything else added using `addMerge()` or `addOperation()` will be transferred by reference when cloning;
		 * i.e., those both add callback functions, which are not cloneable, and thus transferred by reference.
		 */
		this.kinds = {
			MERGE: 'merge',
			MERGE_CLONES: 'mergeClones',

			PATCH: 'patch',
			UPDATE: 'update',
		};
		this.merge = this.prepareMergeHandler(this.kinds.MERGE);
		this.mergeClones = this.prepareMergeHandler(this.kinds.MERGE_CLONES);

		this.patch = this.prepareMergeHandler(this.kinds.PATCH);
		this.update = this.prepareMergeHandler(this.kinds.UPDATE);
	}

	/**
	 * Creates a new instance.
	 *
	 * @returns Newly created class instance.
	 */
	public static newInstance(): MergeChange {
		return new MergeChange(); // See constructor above.
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
		const previousCallback = this[`merge${tagA}${tagB}`] as MergeCallback | undefined;
		this[`merge${tagA}${tagB}`] = callback; // New callback.

		return previousCallback;
	}

	/**
	 * Adds a custom declarative operation.
	 *
	 * @param   name     Operation `$name`, `$ꓺname`.
	 * @param   callback Operation callback.
	 *
	 * @returns          Previous operation callback.
	 */
	public addOperation(name: string, callback: OperationCallback) {
		if (!name || !$isꓺstring(name)) {
			throw new Error('Invalid operation name.');
		}
		if (!$isꓺfunction(callback)) {
			throw new Error('Invalid operation callback.');
		}
		if (!name.startsWith('$')) {
			name = '$' + name; // Must begin with `$`.
		}
		const previousCallback = this[`operation${name}`] as OperationCallback | undefined;
		this[`operation${name}`] = callback; // New callback.

		return previousCallback;
	}

	/**
	 * Protected API. ---
	 */

	/**
	 * Prepares a merge handler.
	 *
	 * @param   kind Kind of merge.
	 *
	 * @returns      Function to handle a kind of merge.
	 */
	protected prepareMergeHandler(kind: Kind): MergeHandler {
		return function (this: MergeChange, ...values: Parameters<MergeHandler>): ReturnType<MergeHandler> {
			return values.reduce((a: unknown, b: unknown): ReturnType<MergeHandler> => {
				const tagA = $objꓺtag(a);
				const tabB = $objꓺtag(b);

				for (const mergeCallback of [
					`merge${tagA}${tabB}`, //
					`merge${tagA}Any`,
					`mergeAny${tabB}`,
					`mergeAnyAny`,
				]) {
					if ($isꓺfunction(this[mergeCallback])) {
						return (this[mergeCallback] as MergeCallback)(a, b, kind);
					}
				}
				throw new Error('Unsupported merge type.');
			});
		} as MergeHandler;
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
		for (const key of Object.keys(value)) {
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
	 * @param   a    Array A.
	 * @param   b    Array B.
	 * @param   kind Merge kind.
	 *
	 * @returns      Merged array.
	 */
	protected mergeArrayArray(a: unknown[], b: unknown[], kind: Kind): unknown[] {
		return [
			this.kinds.MERGE, //
			this.kinds.MERGE_CLONES,
		].includes(kind)
			? b.map((value) => this[kind](undefined, value))
			: b;
	}

	/**
	 * Merges Object with Object.
	 *
	 * @param   a    Object A.
	 * @param   b    Object B.
	 * @param   kind Merge kind.
	 *
	 * @returns      Merged object.
	 */
	protected mergeObjectObject(a: $type.Object, b: $type.Object, kind: Kind): $type.Object {
		let returnClone = [
			this.kinds.MERGE, //
			this.kinds.MERGE_CLONES,
		].includes(kind);

		const aKeys = $objꓺkeysAndSymbols(a);
		const bKeys = new Set($objꓺkeysAndSymbols(b));

		const patchClone = this.kinds.PATCH === kind
			? a // Patching `a` source object in this case.
			: ({} as $type.Object); // prettier-ignore

		let keyResult; // Initialize; used below.
		const operations: [string, unknown][] = [];

		for (const key of aKeys) {
			if (key in b /* Own or inherited in this case. */) {
				keyResult = this[kind](a[key], b[key]);
				bKeys.delete(key);
			} else {
				keyResult = this[kind](undefined, a[key]);
			}
			returnClone = returnClone || keyResult !== a[key];
			patchClone[key] = keyResult; // Update by assignment.
		}
		for (const key of /* Remaining. */ bKeys) {
			if ($isꓺstring(key) && this.isOperation(key)) {
				operations.push([key, b[key]]);
			} else {
				keyResult = this[kind](undefined, b[key]);
				returnClone = returnClone || keyResult !== a[key];
				patchClone[key] = keyResult; // Update by assignment.
			}
		}
		for (const [operation, params] of operations) {
			returnClone = this.performOperation(patchClone, operation, params) || returnClone;
		}
		return returnClone ? patchClone : a;
	}

	/**
	 * Merges Undefined with Array.
	 *
	 * @param   a    Undefined.
	 * @param   b    Array B.
	 * @param   kind Merge kind.
	 *
	 * @returns      Merged array.
	 */
	protected mergeUndefinedArray(a: undefined, b: unknown[], kind: Kind): unknown[] {
		return [
			this.kinds.MERGE, //
			this.kinds.MERGE_CLONES,
		].includes(kind)
			? this[kind]([], b)
			: b;
	}

	/**
	 * Merges Undefined with Object.
	 *
	 * @param   a    Undefined.
	 * @param   b    Object B.
	 * @param   kind Merge kind.
	 *
	 * @returns      Merged object.
	 */
	protected mergeUndefinedObject(a: undefined, b: $type.Object, kind: Kind): $type.Object {
		return [
			this.kinds.MERGE, //
			this.kinds.MERGE_CLONES,
		].includes(kind)
			? this[kind]({} as $type.Object, b)
			: this[kind](b, this.extractOperations(b));
	}

	/**
	 * Merges Any with Any.
	 *
	 * @param   a    Unknown A.
	 * @param   b    Unknown B.
	 * @param   kind Merge kind.
	 *
	 * @returns      Merged object.
	 */
	protected mergeAnyAny(a: unknown, b: unknown, kind: Kind): unknown {
		const value = undefined === b ? a : b;

		if (!$isꓺobject(value)) {
			return value; // Unnecessary; i.e., primitive.
			//
		} else if ($isꓺfunction(this['mergeUndefined' + $objꓺtag(value)])) {
			return this[kind](undefined, value);
		}
		// Only create a deep clone when merging clones.
		// Otherwise, merge is lossless; i.e., we transfer unsupported types.
		return this.kinds.MERGE_CLONES === kind ? $objꓺcloneDeep(value) : value;
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
	 * Performs declarative operation: `$unset`, `$ꓺunset` (aka: `$omit`, `$ꓺomit`).
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
	 * @note However, the use of `*` only unsets array keys, or end-own enumerable string keys.
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
	 * Performs declarative operation: `$leave`, `$ꓺleave` (aka: `$pick`, `$ꓺpick`).
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
		const leavePaths: { [x: $type.ObjectPath]: $type.ObjectPath[] } = {};

		for (const path of params) {
			if (!$isꓺsafeObjectPath(path)) {
				throw new Error('Invalid ' + calledAs + ' param. Expecting object path.');
			}
			let leavePath: $type.ObjectPath = path;
			let subPaths: $type.ObjectPath[] = [];

			if ($isꓺstring(path) /* Split path into parts. */) {
				[leavePath, ...subPaths] = $obpꓺsplitPath(path, separator);
			}
			if (!leavePaths[leavePath]) {
				leavePaths[leavePath] = []; // Initialize.
			}
			if (subPaths.length) {
				leavePaths[leavePath].push(subPaths.join(separator));
			}
		}
		if ($isꓺarray(target)) {
			for (let key = target.length - 1; key >= 0; key--) {
				if (!(key in leavePaths)) {
					target.splice(key, 1); // Not leaving this key.
					//
				} else if (leavePaths[key].length && $isꓺobject(target[key])) {
					this.operation$leave(target[key], leavePaths[key], separator, calledAs);
				}
			}
		} /* Note: `Object.keys()` returns end-own enumerable string keys; i.e., of current `source`. */ else {
			for (const key of Object.keys(target) /* Preserves symbol keys. */) {
				if (!(key in leavePaths)) {
					delete target[key]; // Not leaving this key.
					//
				} else if (leavePaths[key].length && $isꓺobject(target[key])) {
					this.operation$leave(target[key], leavePaths[key], separator, calledAs);
				}
			}
		}
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
	 * Performs declarative operation: `$default`, `$ꓺdefault` (aka: `$defaults`, `$ꓺdefaults`).
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
	 * Performs declarative operation: `$keySortOrder`, `$ꓺkeySortOrder` (aka: `$propSortOrder`, `$ꓺpropSortOrder`).
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
	 * - Unsorted own enumerable string keys. Aside from being repositioned to come after those that have been explicity
	 *   targeted by `params`, their deeper ordering is preserved; i.e., as original and unmodified insertion order.
	 * - Symbol keys in their existing and unmodified insertion order. There is no way to sort these using object paths,
	 *   as object paths do not support symbols. Even if they did, symbol keys are always last in any object type.
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
		const unsortedPaths: Set<$type.ObjectPath> = new Set(Object.keys($toꓺplainFlatObject(target)));

		/*
		 * These are of any depth; i.e., shallow or deep paths targeted by `params`.
		 */
		for (const path of params) {
			if (!$isꓺsafeObjectPath(path)) {
				throw new Error('Invalid ' + calledAs + ' param. Expecting object path.');
			}
			if ($obpꓺhas(target, path, separator)) {
				unsortedPaths.delete(path); // Sorting now.
				const value = $obpꓺget(target, path, undefined, separator);
				$obpꓺunset(target, path, separator), $obpꓺset(target, path, value, separator);
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
		for (const path of unsortedPaths) {
			const value = $obpꓺget(target, path, undefined, separator);
			$obpꓺunset(target, path, separator), $obpꓺset(target, path, value, separator);
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
}

/**
 * Default export.
 */
const mergeChange = new MergeChange();
export default mergeChange; // Class instance.
