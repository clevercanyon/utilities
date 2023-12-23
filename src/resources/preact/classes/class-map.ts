/**
 * Class map class.
 */

/**
 * Constructor cache.
 */
let ClassMap: Constructor;

/**
 * Defines types.
 */
export type Constructor = {
    new (): Class; // Class map instance.
};
export type Class = ClassInterface;

declare class ClassInterface extends Map<string, boolean> {
    public hasTextWrap(): boolean;
    public hasTextSize(): boolean;
}

/**
 * Class map factory.
 *
 * @returns Class constructor.
 */
export const getClass = (): Constructor => {
    if (ClassMap) return ClassMap;

    ClassMap = class extends Map<string, boolean> implements Class {
        /**
         * Checks if map has a `text-[wrap]` class.
         *
         * @returns True if map has a `text-[wrap]` class.
         */
        public hasTextWrap(): boolean {
            const regExp = /^text-(?:wrap|nowrap|balance|pretty)$/iu;
            return [...this.keys()].some((c) => regExp.test(c));
        }

        /**
         * Checks if map has a `text-[size]` class.
         *
         * @returns True if map has a `text-[size]` class.
         */
        public hasTextSize(): boolean {
            const regExp = /^text-(?:xs|sm|base|lg|[0-9]*xl)$/iu;
            return [...this.keys()].some((c) => regExp.test(c));
        }
    };
    return Object.defineProperty(ClassMap, 'name', {
        ...Object.getOwnPropertyDescriptor(ClassMap, 'name'),
        value: 'ClassMap',
    });
};
