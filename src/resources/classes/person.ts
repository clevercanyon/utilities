/**
 * Person utility class.
 */

import { $class, $obj, $str, $symbol, $url, type $type } from '#index.ts';

/**
 * Constructor cache.
 */
let Person: Constructor;

/**
 * Defines types.
 */
export type RawProps = Omit<ClassInterfaceProps, 'name'> & {
    name?: string; // Optional, can be derived from `firstName`, `lastName`.
};
export type C9rProps = Omit<ClassInterfaceProps, 'name'> & {
    name?: string; // Optional, can be derived from `firstName`, `lastName`.
};
export type Constructor = {
    new (props: C9rProps | Class): Class;
};
export type Class = $type.Utility & ClassInterface;

declare class ClassInterface {
    public readonly firstName: string;
    public readonly lastName: string;

    public readonly name: string;
    public readonly username: string;

    public readonly headline: string;
    public readonly description: string;

    public readonly url: string;
    public readonly location: string;

    public readonly gravatar: {
        readonly url: string;
        readonly width: number;
        readonly height: number;
    };
    public readonly socialProfiles: {
        readonly [x: string]: string;
    };
    public constructor(props: C9rProps | Class);
    public gravatarSize(size: number): string;
    public rawProps(): RawProps;
}
type ClassInterfaceProps = Omit<ClassInterface, 'constructor' | 'gravatarSize' | 'rawProps'>;

/**
 * Person class factory.
 *
 * @returns Class constructor.
 */
export const getClass = (): Constructor => {
    if (Person) return Person;

    Person = class extends $class.getUtility() implements Class {
        /**
         * First name; e.g., `Jason`.
         */
        public readonly firstName!: string;

        /**
         * Last name; e.g., `Caldwell`.
         */
        public readonly lastName!: string;

        /**
         * Full name; e.g., `Jason Caldwell`.
         */
        public readonly name!: string;

        /**
         * Username; e.g., `jaswrks`.
         */
        public readonly username!: string;

        /**
         * Headline; e.g., `Engineering Manager, Consultant, Staff Engineer`.
         */
        public readonly headline!: string;

        /**
         * Description; e.g., `Entrepreneur and full-stack engineer with 20+ years experience.`.
         */
        public readonly description!: string;

        /**
         * URL; e.g., `https://jaswrks.com/`.
         */
        public readonly url!: string;

        /**
         * Location; e.g., `Northern Maine, USA`.
         */
        public readonly location!: string;

        /**
         * Gravatar, with dimensions.
         */
        public readonly gravatar!: {
            readonly url: string;
            readonly width: number;
            readonly height: number;
        };

        /**
         * Social profile URLs.
         */
        public readonly socialProfiles!: {
            readonly [x: string]: string;
        };

        /**
         * Object constructor.
         *
         * @param props Props or instance.
         */
        public constructor(props: C9rProps | Class) {
            super(); // Parent constructor.
            const isClone = props instanceof Person;

            for (const [key, value] of $obj.keyAndSymbolEntries(props)) {
                this[key] = value; // Property assignments.
            }
            this.name = $str.trim(this.firstName + ' ' + this.lastName);

            if (isClone) {
                // Clones will freeze; i.e., upon cloning.
                // {@see $symbol.objDeepFreezeClones}.
            } else {
                $obj.deepFreeze(this); // Enforces readonly.
            }
        }

        /**
         * {@see $obj.clone()}, {@see $obj.cloneDeep()} helper.
         *
         * @returns True if object clones should be frozen deeply.
         */
        public get [$symbol.objDeepFreezeClones](): ReturnType<$type.objDeepFreezeClonesSymbolFn> {
            return true; // Default value.
        }

        /**
         * Gravatar at a specific size.
         *
         * @param   size Size; e.g., `96`.
         *
         * @returns      Gravatar URL.
         */
        public gravatarSize(size: number): string {
            return $url.addQueryVar('s', String(size), this.gravatar.url);
        }

        /**
         * Produces raw props.
         *
         * @returns Object {@see RawProps}.
         */
        public rawProps(): RawProps {
            // Enforces person raw props being readonly.
            return $obj.deepFreeze({ ...this });
        }
    };
    return Object.defineProperty(Person, 'name', {
        ...Object.getOwnPropertyDescriptor(Person, 'name'),
        value: 'Person',
    });
};
