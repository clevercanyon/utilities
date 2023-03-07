/**
 * Class utilities.
 */

import * as $type from './type.js';

/**
 * Exports abstract base class.
 */
export { default as Base } from './resources/classes/a6t/base.js';

/**
 * Makes proto-inherited class keys ‘own’ and ‘enumerable’.
 *
 * To be used as a TypeScript class decorator.
 *
 *      e.g., `@$class.keysOwnEnumerable('key', 'key', 'key', ...) class {}`.
 *      e.g., `@$class.keysOwnEnumerable(['key', 'key', 'key', ...]) class {}`.
 *
 * Standard class keys (i.e., properties that are not private) are already ‘own’ and ‘enumerable’ and therefore are not
 * considered here. Private keys are also not considered here. This decorator is only necessary when proto-inherited
 * non-private keys, such as non-private methods, need to be made ‘own’ ‘enumerable’ for whatever reason.
 *
 * @param   keys Class keys. Arrays are all flattened before iterating.
 *
 * @returns      Class constructor.
 *
 * @note See: <https://o5p.me/nYrgMS> regarding JS classes.
 * @note See: <https://o5p.me/hyLBQN> regarding JS class semantics.
 */
export const keysOwnEnumerable = (...keys: ($type.ObjectKey | $type.ObjectKey[])[]): (<Type>(Class: Type) => Type) => {
	return <Type>(Class: Type): Type => {
		const ClassC9r = Class as $type.ClassC9r;

		// The use of `ClassC9r.name` preserves the original constructor name.
		// Even anonymous classes can be assigned to a variable so they have a constructor name.
		// That said, this supports truly anonymous classes by simply defaulting to `''` as the name.
		return {
			[ClassC9r.name || '']: class extends ClassC9r {
				constructor(...args: unknown[]) {
					super(...args);

					for (const key of keys.flat()) {
						const propDescriptor = Object.getOwnPropertyDescriptor(ClassC9r.prototype, key);

						if (propDescriptor /* Only if key is valid; i.e., has descriptor. */) {
							Object.defineProperty(this, key, { ...propDescriptor, enumerable: true });
						}
					}
				}
			},
		}[ClassC9r.name || ''] as Type;
	};
};

/**
 * Makes ‘own’ class keys not ‘enumerable’.
 *
 * To be used as a TypeScript class decorator.
 *
 *      e.g., `@$class.keysNotEnumerable('key', 'key', 'key', ...) class {}`.
 *      e.g., `@$class.keysNotEnumerable(['key', 'key', 'key', ...]) class {}`.
 *
 * Proto-inherited keys (e.g., methods) and any private keys are not ‘own’ keys and therefore are not considered here.
 * This decorator is only necessary when ‘own’ ‘enumerable’ keys need their ‘enumerable’ flag set to false.
 *
 * @param   keys Class keys. Arrays are all flattened before iterating.
 *
 * @returns      Class constructor.
 *
 * @note See: <https://o5p.me/nYrgMS> regarding JS classes.
 * @note See: <https://o5p.me/hyLBQN> regarding JS class semantics.
 */
export const keysNotEnumerable = (...keys: ($type.ObjectKey | $type.ObjectKey[])[]): (<Type>(Class: Type) => Type) => {
	return <Type>(Class: Type): Type => {
		const ClassC9r = Class as $type.ClassC9r;

		// The use of `ClassC9r.name` preserves the original constructor name.
		// Even anonymous classes can be assigned to a variable so they have a constructor name.
		// That said, this supports truly anonymous classes by simply defaulting to `''` as the name.
		return {
			[ClassC9r.name || '']: class extends ClassC9r {
				constructor(...args: unknown[]) {
					super(...args);

					for (const key of keys.flat()) {
						const propDescriptor = Object.getOwnPropertyDescriptor(this, key);

						if (propDescriptor /* Only if key is valid; i.e., has descriptor. */) {
							Object.defineProperty(this, key, { ...propDescriptor, enumerable: false });
						}
					}
				}
			},
		}[ClassC9r.name || ''] as Type;
	};
};

/**
 * Makes ‘own’ class keys not ‘writable’.
 *
 * To be used as a TypeScript class decorator.
 *
 *      e.g., `@$class.keysNotWritable('key', 'key', 'key', ...) class {}`.
 *      e.g., `@$class.keysNotWritable(['key', 'key', 'key', ...]) class {}`.
 *
 * Proto-inherited keys (e.g., methods) and any private keys are not ‘own’ keys and therefore are not considered here.
 * This decorator is only necessary when ‘own’ ‘writable’ keys need their ‘writable’ flag set to false.
 *
 * @param   keys Class keys. Arrays are all flattened before iterating.
 *
 * @returns      Class constructor.
 *
 * @note See: <https://o5p.me/nYrgMS> regarding JS classes.
 * @note See: <https://o5p.me/hyLBQN> regarding JS class semantics.
 */
export const keysNotWritable = (...keys: ($type.ObjectKey | $type.ObjectKey[])[]): (<Type>(Class: Type) => Type) => {
	return <Type>(Class: Type): Type => {
		const ClassC9r = Class as $type.ClassC9r;

		// The use of `ClassC9r.name` preserves the original constructor name.
		// Even anonymous classes can be assigned to a variable so they have a constructor name.
		// That said, this supports truly anonymous classes by simply defaulting to `''` as the name.
		return {
			[ClassC9r.name || '']: class extends ClassC9r {
				constructor(...args: unknown[]) {
					super(...args);

					for (const key of keys.flat()) {
						const propDescriptor = Object.getOwnPropertyDescriptor(this, key);

						if (propDescriptor /* Only if key is valid; i.e., has descriptor. */) {
							Object.defineProperty(this, key, { ...propDescriptor, writable: false });
						}
					}
				}
			},
		}[ClassC9r.name || ''] as Type;
	};
};
