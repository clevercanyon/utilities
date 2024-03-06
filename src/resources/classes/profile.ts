/**
 * Profile utility class.
 */

import { $class, $is, $obj, $str, $symbol, $url, type $type } from '#index.ts';

/**
 * Constructor cache.
 */
let Profile: Constructor;

/**
 * Defines types.
 */
export type RawProps = Omit<ClassInterfaceProps, 'name' | 'firstName' | 'lastName'> & {
    name?: string;
    firstName?: string;
    lastName?: string;
};
export type C9rProps = RawProps;

export type Constructor = {
    new (props: C9rProps | Class): Class;
};
export type Class = $type.Utility & ClassInterface;

declare class ClassInterface {
    public readonly name: string;
    public readonly firstName: string;
    public readonly lastName: string;
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
    public gravatarSize(size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048): string;
    public rawProps(): RawProps;
}
type ClassInterfaceProps = Omit<ClassInterface, 'constructor' | 'gravatarSize' | 'rawProps'>;

/**
 * Profile class factory.
 *
 * @returns Class constructor.
 */
export const getClass = (): Constructor => {
    if (Profile) return Profile;

    Profile = class extends $class.getUtility() implements Class {
        /**
         * Full name; e.g., `Jason Caldwell`.
         */
        public readonly name!: string;

        /**
         * First name; e.g., `Jason`.
         */
        public readonly firstName!: string;

        /**
         * Last name; e.g., `Caldwell`.
         */
        public readonly lastName!: string;

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
            const isClone = $is.profile(props);

            this.name = this.firstName = this.lastName = '';

            for (const [key, value] of $obj.keyAndSymbolEntries(props)) {
                this[key] = value; // Property assignments.
            }
            if (!this.name /* Derives `name` from `firstName` & `lastName`. */) {
                this.name = $str.trim(this.firstName + ' ' + this.lastName);
            }
            const nameParts = this.name.split(/\s+/u).filter((part) => {
                return !/^(?:Mr|Ms|Miss|Mrs|Dr|Jr|Sr|Co|Corp|Inc|LL[PC]|LTD|[a-z])\.?$/iu.test(part);
            });
            if (!this.firstName && nameParts.length) this.firstName = nameParts[0];
            if (!this.lastName && nameParts.length > 1) this.lastName = nameParts.slice(-1)[0];

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
         * @param   size Size; e.g., `128`.
         *
         * @returns      Gravatar URL.
         */
        public gravatarSize(size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048): string {
            return $url.addQueryVar('size', String(size), this.gravatar.url);
        }

        /**
         * Produces raw props.
         *
         * @returns Object {@see RawProps}.
         */
        public rawProps(): RawProps {
            // Enforces raw props being readonly.
            return $obj.deepFreeze({ ...this });
        }
    };
    return Object.defineProperty(Profile, 'name', {
        ...Object.getOwnPropertyDescriptor(Profile, 'name'),
        value: 'Profile',
    });
};
