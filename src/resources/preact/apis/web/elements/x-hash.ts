/**
 * Custom element.
 *
 * @requiredEnv web
 *
 * @see https://o5p.me/XMpyDo
 * @see https://o5p.me/Htnn8e
 */

import { $dom, $is, type $type } from '../../../../../index.ts';

/**
 * Constructor cache.
 */
let CustomHTMLHashElement: Constructor;

/**
 * Defines types.
 */
export type Constructor = {
    new (): Class; // Takes in nothing.
};
export type Class = ClassInterface;

type Privatized = {
    '#props': {
        [x: string]: unknown;
        href?: string;
    };
    '#onClick'?: $type.DOMEventTools;
};
declare class ClassInterface extends HTMLElement {
    public get href(): string | undefined;
    public set href(newValue: string | null | undefined);

    public static readonly observedAttributes: string[];
    public attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void;

    public connectedCallback(): void;
    public disconnectedCallback(): void;
}

/**
 * Defines element.
 *
 * @returns Class constructor.
 */
export const define = (): Constructor => {
    /**
     * Defined already?
     */
    if (CustomHTMLHashElement) {
        return CustomHTMLHashElement;
    }

    /**
     * Defines class.
     */
    CustomHTMLHashElement = class extends HTMLElement implements Class {
        /**
         * Properties.
         */
        #props: Privatized['#props'] = {};

        /**
         * On-click event tools.
         */
        #onClick?: Privatized['#onClick'];

        /**
         * Gets hyperlink reference.
         */
        public get href(): Privatized['#props']['href'] {
            return this.#props.href;
        }

        /**
         * Sets hyperlink reference.
         *
         * @param newValue New hyperlink value.
         */
        public set href(newValue: string | null | undefined) {
            this.#props.href = newValue || undefined;
            $dom.setAtts(this, { href: this.#props.href });
        }

        /**
         * Gets observed attribute names.
         *
         * @returns Observed attribute names.
         */
        public static get observedAttributes(): string[] {
            return ['href']; // Only one, for now.
        }

        /**
         * Handles attribute changes.
         *
         * {@see attributeChangedCallback()} is called whenever an observed attribute has been added, removed, updated,
         * or replaced. Only attributes returned by the {@see observedAttributes} property will receive callbacks.
         *
         * If an element's HTML markup includes an observed attribute, the first change callbacks occur whenever the
         * element's markup is parsed for the first time. In the following example markup, `bar`, `baz` would trigger
         * {@see attributeChangedCallback()} twice whenever the DOM is initially parsed; i.e., for each of the two
         * attributes. Other callbacks may occur later should any attribute be changed in some way.
         *
         *     <x-foo bar="." baz="."></x-foo>
         *
         * Many HTML properties reflect their changes back to DOM attributes. Therefore, change callbacks often fire
         * whenever a property is modified via JavaScript. For that reason, please be careful to avoid infinite loops
         * caused by attempting to modify a property in response to an attribute being changed, which can result in yet
         * another attribute change callback, creating an infinite loop.
         *
         * @param name     Attribute name.
         * @param oldValue Old attribute value.
         * @param newValue New attribute value.
         *
         * @note Attribute names can differ from property names, but for now, there is only one property; i.e., `href`, and it
         *       is exactly the same name. Therefore, we forgo additional code, for now, in favor of minimization.
         */
        public attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
            this.#props[name] = newValue;
        }

        /**
         * Runs DOM setup routines.
         */
        public connectedCallback(): void {
            this.#onClick = $dom.on(this, 'click', (event: Event): void => {
                if (this.#props.href && $is.leftClickMouseEvent(event)) {
                    const l = location; // For minified reuse below.
                    // Empty, then change, to force a scroll change.
                    (l.hash = ''), (l.hash = this.#props.href);
                }
            });
        }

        /**
         * Runs DOM cleanup routines.
         */
        public disconnectedCallback(): void {
            this.#onClick?.cancel();
        }
    };

    /**
     * Defines element.
     */
    customElements.define('x-hash', CustomHTMLHashElement);

    /**
     * Returns constructor.
     */
    return CustomHTMLHashElement;
};
