/**
 * Utility class.
 */

import { $app, $class, type $type } from '../../index.ts';

let Defined: Constructor | undefined; // Cache.

/**
 * Defines types.
 */
export type Constructor = {
    readonly appPkgName: string;
    new (): Class; // Takes in nothing.
};
export type Class = $type.Base & ClassInterface;

declare class ClassInterface {
    public static readonly appPkgName: string;
    public constructor(); // Takes in nothing.
}

/**
 * Utility class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
    if (Defined) return Defined;

    Defined = class extends $class.getBase() implements Class {
        /**
         * App package name.
         */
        public static readonly appPkgName = $app.pkgName;

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
    return Object.defineProperty(Defined, 'name', {
        ...Object.getOwnPropertyDescriptor(Defined, 'name'),
        value: 'Utility',
    });
};
