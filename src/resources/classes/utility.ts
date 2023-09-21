/**
 * Utility class.
 */

import { pkgName as $appꓺpkgName } from '../../app.ts';
import type { Interface as $classꓺBaseInterface } from './base.ts';
import { getClass as $classꓺgetBase } from './base.ts';

let Class: Constructor | undefined; // Class definition cache.

/**
 * Defines types.
 */
export type Constructor = {
    readonly appPkgName: string;
    new (): Interface; // Takes in nothing.
};
export declare class Interface extends $classꓺBaseInterface {
    public static readonly appPkgName: string;
    public constructor(); // Takes in nothing.
}

/**
 * Utility class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
    if (Class) return Class;

    Class = class extends $classꓺgetBase() implements Interface {
        /**
         * App package name.
         */
        public static readonly appPkgName = $appꓺpkgName;

        /**
         * Object constructor.
         */
        public constructor(/* Takes in nothing. */) {
            super(); // Base constructor.
            // ---
            // Note: Classes extending this base *must* be capable
            // of handling the first constructor argument being passed as
            // an instance of itself; i.e., to facilitate shallow|deep cloning.
        }
    };
    return Object.defineProperty(Class, 'name', {
        ...Object.getOwnPropertyDescriptor(Class, 'name'),
        value: 'Utility',
    });
};
