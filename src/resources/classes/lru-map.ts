/**
 * LRU Map utility class.
 */

/**
 * Constructor cache.
 */
let LRUMap: Constructor;

/**
 * Defines types.
 */
export type C9rProps = {
    maxSize?: number;
};
export type Constructor = {
    get [Symbol.species](): MapConstructor;
    new <KeyType = unknown, ValueType = unknown>(entries?: Entries<KeyType, ValueType>, props?: C9rProps): Class<KeyType, ValueType>;
};
export type Class<KeyType = unknown, ValueType = unknown> = ClassInterface<KeyType, ValueType>;

declare class ClassInterface<KeyType = unknown, ValueType = unknown> extends Map<KeyType, ValueType> {
    public maxSize: number; // Writable on-the-fly.
    public constructor(entries?: Entries<KeyType, ValueType>, props?: C9rProps);
    public get(key: KeyType): ValueType | undefined;
}
type Entries<KeyType = unknown, ValueType = unknown> = Readonly<Readonly<[KeyType, ValueType]>[]> | Iterable<Readonly<[KeyType, ValueType]>> | null;

/**
 * LRU Map class factory.
 *
 * @returns Class constructor.
 */
export const getClass = (): Constructor => {
    if (LRUMap) return LRUMap;

    return (LRUMap = class<KeyType = unknown, ValueType = unknown> extends Map<KeyType, ValueType> implements Class<KeyType, ValueType> {
        /**
         * Maximum size.
         */
        public maxSize: number; // Writable on-the-fly.

        /**
         * Defines map species.
         */
        public static get [Symbol.species](): MapConstructor {
            return LRUMap; // Use own constructor.
        }

        /**
         * Object constructor.
         *
         * @param props Props or instance.
         */
        public constructor(entries?: Entries<KeyType, ValueType>, props?: C9rProps) {
            super(entries); // Parent constructor.
            this.maxSize = props?.maxSize || Infinity;
        }

        /**
         * Gets a value.
         *
         * @param   key Key.
         *
         * @returns     Value, or `undefined`.
         */
        public get(key: KeyType): ValueType | undefined {
            if (!this.has(key)) {
                return undefined;
            }
            const value = super.get(key);

            this.delete(key); // Reinserts at end of map.
            if (value !== undefined) super.set(key, value);

            return value;
        }

        /**
         * Sets a value.
         *
         * @param   key   Key.
         * @param   value Value.
         *
         * @returns       Map instance.
         */
        public set(key: KeyType, value: ValueType): this {
            if (this.has(key)) this.delete(key);
            super.set(key, value); // Reinserts at end of map.

            let keys; // Least recently used (LRU) keys.
            while (this.size && this.size > this.maxSize) {
                (keys ??= this.keys()), this.delete(keys.next().value as KeyType);
            }
            return this;
        }
    });
};
