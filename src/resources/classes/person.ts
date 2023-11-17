/**
 * Person utility class.
 */

import { $class, $obj, $str, type $type } from '../../index.ts';

/**
 * Class object cache.
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

    public readonly avatar: {
        readonly png: string;
        readonly width: number;
        readonly height: number;
    };
    public readonly socialProfiles: {
        readonly [x: string]: string;
    };
    public constructor(props: C9rProps | Class);
    public rawProps(): RawProps;
}
type ClassInterfaceProps = Omit<ClassInterface, 'constructor' | 'rawProps'>;

/**
 * Person class factory.
 *
 * @returns {@see Constructor} Definition.
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
         * Avatar, with dimensions.
         */
        public readonly avatar!: {
            readonly png: string;
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

            for (const [key, value] of $obj.keyAndSymbolEntries(props)) {
                this[key] = value; // Property assignments.
            }
            this.name = $str.trim(this.firstName + ' ' + this.lastName);
        }

        /**
         * Produces raw props.
         *
         * @returns Object {@see RawProps}.
         */
        public rawProps(): RawProps {
            return { ...this };
        }
    };
    return Object.defineProperty(Person, 'name', {
        ...Object.getOwnPropertyDescriptor(Person, 'name'),
        value: 'Person',
    });
};
