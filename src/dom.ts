/**
 * DOM utilities.
 */

import './resources/init.ts';

import { $is, $obj, $preact, $to, type $type } from './index.ts';

/**
 * Defines types.
 */
type AnyAtts = { [x: string]: unknown };

/**
 * Fires a callback on document ready state.
 *
 * @param   callback Callback.
 *
 * @returns          Object with `cancel` function.
 *
 * @requiredEnv web
 */
export const onReady = (callback: () => void): { cancel: () => void } => {
    const eventName = 'DOMContentLoaded';

    if ('loading' !== document.readyState) {
        callback(); // Fires callback immediately.
    } else {
        addEventListener(eventName, callback);
    }
    return { cancel: () => removeEventListener(eventName, callback) };
};

/**
 * Fires a callback on window loaded state.
 *
 * @param   callback Callback.
 *
 * @returns          Object with `cancel` function.
 *
 * @requiredEnv web
 */
export const onLoad = (callback: () => void): { cancel: () => void } => {
    const eventName = 'load';

    if ('complete' === document.readyState) {
        callback(); // Fires callback immediately.
    } else {
        addEventListener(eventName, callback);
    }
    return { cancel: () => removeEventListener(eventName, callback) };
};

/**
 * Fires a callback on the next frame.
 *
 * @param   callback Callback.
 *
 * @returns          Object with `cancel` function.
 *
 * @requiredEnv web
 */
export const onNextFrame = (callback: () => void): { cancel: () => void } => {
    const raf = requestAnimationFrame(callback);
    return { cancel: () => cancelAnimationFrame(raf) };
};

/**
 * Fires a callback after the next frame.
 *
 * Callback is invoked after the browser has a painted a new frame. We accomplish this by combining use of RAF; i.e.,
 * {@see requestAnimationFrame} together with {@see setTimeout()} to invoke a callback after the next frame. A timeout
 * is scheduled in parallel to ensure the callback is always invoked; e.g., if the browser tab is not visible.
 *
 * @param   callback Callback.
 *
 * @returns          Object with `cancel` function.
 *
 * @requiredEnv web
 */
export const afterNextFrame = (callback: () => void): { cancel: () => void } => {
    const done = () => {
        clearTimeout(timeout);
        cancelAnimationFrame(raf);
        setTimeout(callback);
    };
    const timeout = setTimeout(done, 100);
    const raf = requestAnimationFrame(done);
    return {
        cancel: (): void => {
            cancelAnimationFrame(raf);
            clearTimeout(timeout);
        },
    };
};

/**
 * Fires a callback on a named event.
 *
 * @param   wdes      Window, document, element, or selectors.
 * @param   eventName Event name. Required always.
 * @param   selectors Selectors for delegated events.
 * @param   callback  Callback for event handler.
 *
 * @returns           Object with `cancel` function.
 *
 * @requiredEnv web
 */
export function on(wdes: Window | Document | Element | string, eventName: string, callback: (x: Event) => void): { cancel: () => void };
export function on(wdes: Window | Document | Element | string, eventName: string, selectors: string, callback: (x: Event) => void): { cancel: () => void };

export function on(...args: unknown[]): { cancel: () => void } {
    const wdes = args[0] as Window | Document | Element | string;
    const wde = $is.string(wdes) ? require(wdes) : wdes;

    const eventName = args[1] as string;
    let selectors: string; // Initialize.

    let callback: (x: Event) => void;
    let actualCallback: (x: Event) => void;

    if (args.length >= 4) {
        selectors = args[2] as typeof selectors;
        callback = args[3] as typeof callback;
    } else {
        selectors = '' as typeof selectors;
        callback = args[2] as typeof callback;
    }
    if (selectors && callback) {
        actualCallback = (event: Event): void => {
            let target = event.target;

            if (!$is.element(target)) {
                return; // Not applicable.
            }
            do {
                if (target.matches(selectors)) {
                    callback.call(target, event);
                }
            } while ($is.element((target = target.parentNode)) && target !== event.currentTarget);
        };
    } else actualCallback = callback;

    wde.addEventListener(eventName, actualCallback);
    return { cancel: () => wde.removeEventListener(eventName, actualCallback) };
}

/**
 * Triggers a custom event.
 *
 * @param wdes      Window, document, element, or selectors.
 * @param eventName Name of custom event; make sure it’s unique.
 * @param data      Any custom data to pass as `detail` to event listeners.
 */
export const trigger = (wdes: Window | Document | Element | string, eventName: string, data: $type.Object = {}): void => {
    const wde = $is.string(wdes) ? require(wdes) : wdes;
    wde.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: data }));
};

/**
 * Appends an element to `<head>`.
 *
 * @param element Element to attach.
 *
 * @requiredEnv web
 */
export const headAppend = (element: Element): void => {
    require('head').appendChild(element);
};

/**
 * Appends an element to `<body>`.
 *
 * @param element Element to attach.
 *
 * @requiredEnv web
 */
export const bodyAppend = (element: Element): void => {
    require('body').appendChild(element);
};

/**
 * Appends a `<link rel="stylesheet" media="all">` to `<head>`.
 *
 * @param href Stylesheet source.
 * @param atts Optional attributes.
 *
 *   - Attributes may override default `rel`, `media` if necessary.
 *
 * @requiredEnv web
 */
export const appendStyle = (href: string, atts: Partial<HTMLLinkElement> = {}): void => {
    headAppend(create('link', { rel: 'stylesheet', media: 'all', ...atts, href }));
};

/**
 * Appends a `<script async>` to `<head>`.
 *
 * @param src  Script source.
 * @param atts Optional attributes.
 *
 *   - Attributes may override default `async` if necessary.
 *
 * @requiredEnv web
 */
export const appendScript = (src: string, atts: Partial<HTMLScriptElement> = {}): void => {
    headAppend(create('script', { async: true, ...atts, src }));
};

/**
 * Appends a `<script type="module">` to `<head>`.
 *
 * @param src  Script source.
 * @param atts Optional attributes.
 *
 *   - Attributes may override default `type` if necessary.
 *
 * @requiredEnv web
 */
export const appendModule = (src: string, atts: Partial<HTMLScriptElement> = {}): void => {
    headAppend(create('script', { type: 'module', ...atts, src }));
};

/**
 * Creates a new text node, SVG, HTML, or other element.
 *
 * @param   tag  `textNode`, `svg`, or other HTML tag name.
 * @param   atts Optional attributes. Or, plain text when `tag=textNode`.
 *
 * @returns      Text node, SVG, HTML, or other element.
 *
 * @requiredEnv web
 */
export function create(tag: 'textNode', value?: $type.Primitive): Text;
export function create<Tag extends keyof HTMLElementTagNameMap>(tag: Tag, atts?: Partial<HTMLElementTagNameMap[Tag]>): HTMLElementTagNameMap[Tag];
export function create<Tag extends keyof SVGElementTagNameMap>(tag: Tag, atts?: Partial<SVGElementTagNameMap[Tag]>): SVGElementTagNameMap[Tag];
export function create<Tag extends keyof MathMLElementTagNameMap>(tag: Tag, atts?: Partial<MathMLElementTagNameMap[Tag]>): MathMLElementTagNameMap[Tag];
export function create<Tag extends keyof HTMLElementDeprecatedTagNameMap>(tag: Tag, atts?: Partial<HTMLElementDeprecatedTagNameMap[Tag]>): HTMLElementDeprecatedTagNameMap[Tag];
export function create(tag: string, atts?: AnyAtts): Element;

export function create(...args: unknown[]): Text | Element {
    const tag = (args[0] as string).toLowerCase();
    let value: $type.Primitive | undefined, atts: AnyAtts | undefined;

    if ('textNode' === tag) {
        value = args[1] as typeof value;
        return document.createTextNode($to.string(value));
    } else {
        let element; // Initialize.
        atts = args[1] as typeof atts;

        if ('svg' === tag) {
            element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        } else {
            element = document.createElement(tag);
        }
        if (atts) setAtts(element, atts);

        return element;
    }
}
export { create as h }; // `h` is short for hyperscript. Meaning, "JavaScript that produces HTML".

/**
 * Resets an element’s attributes.
 *
 * This utility is simply one that resets arbitrary attributes for any element type. Thus, we use an intentionally loose
 * type for `atts`, as we prefer to avoid colliding with any type validations that have already occurred higher up in
 * the call stack; e.g., in a more element-specific context.
 *
 * - Attributes that are being set will not first be removed. Saves time.
 * - Attributes that already exist with the same value will not be set again.
 * - For further details, {@see setAtts()}.
 *
 * @param element Element.
 * @param atts    Attributes.
 *
 * @requiredEnv web
 */
export const newAtts = (element: Element, atts: AnyAtts): void => {
    for (let i = 0; i < element.attributes.length; i++) {
        const { name } = element.attributes[i];
        if (!Object.hasOwn(atts, name)) element.removeAttribute(name);
    }
    setAtts(element, atts);
};

/**
 * Sets an element’s attributes.
 *
 * This utility is simply one that sets arbitrary attributes for any element type. Thus, we use an intentionally loose
 * type for `atts`, as we prefer to avoid colliding with any type validations that have already occurred higher up in
 * the call stack; e.g., in a more element-specific context.
 *
 * - Attributes that already exist with the same value will not be set again.
 * - Attributes set to `false`, `null`, or `undefined`, will be removed entirely.
 * - `dangerouslySetInnerHTML` will set `innerHTML`, which is not technically an attribute.
 * - `children` as plain text will set `innerText`, which is not technically an attribute.
 * - This supports attributes with function values; e.g., `onload`, `onclick`, etc.
 *
 * @param element Element.
 * @param atts    Attributes.
 *
 * @requiredEnv web
 */
export const setAtts = (element: Element, atts: AnyAtts): void => {
    // Cast as keyable so we can access properties.
    const elemObj = element as Element & $type.Object;

    // Removes internal preact props, which are not real attributes.
    // We don’t, however, remove `children`, because there are cases in which we can handle.
    atts = $obj.omit(atts, ['jsx', 'ref', 'key']); // We also handle `dangerouslySetInnerHTML`.

    // Consolidates class prop variants into a single `class` attribute.
    if ($preact.classPropVariants().some((variant) => Object.hasOwn(atts, variant))) {
        atts = { ...$preact.omitProps(atts, ['class']), class: $preact.classes(atts) };
    }
    // Iterates all new attribute names/values.
    for (let [name, newValue] of Object.entries(atts)) {
        const currentValue = elemObj.getAttribute(name);

        if ('children' === name) {
            if (!$is.primitive(newValue)) throw new Error();
            const newStrValue = $to.string(newValue); // Text nodes only.
            if (elemObj.innerText !== newStrValue) elemObj.innerText = newStrValue;
            //
        } else if ('dangerouslySetInnerHTML' === name) {
            if (!$is.object(newValue)) throw new Error();
            const newStrValue = $to.string(newValue.__html);
            if (elemObj.innerHTML !== newStrValue) elemObj.innerHTML = newStrValue;
            //
        } else if (true === newValue) {
            if (currentValue !== '') elemObj.setAttribute(name, '');
            //
        } else if (false === newValue || null === newValue || undefined === newValue) {
            if (currentValue !== null) elemObj.removeAttribute(name);
            //
        } else if ($is.function(newValue)) {
            if (elemObj[name] !== newValue) elemObj[name] = newValue;
            //
        } else {
            const newStrValue = $to.string(newValue); // e.g., URL, Time, etc.
            if (currentValue !== newStrValue) elemObj.setAttribute(name, newStrValue);
        }
    }
};

/**
 * Queries DOM element(s).
 *
 * @param   selectors Selectors. Comma-delimited string or array.
 *
 * @returns           An {@see Element|NodeListOf<Element>}; else `null`.
 *
 *   - Passing `selectors` as a string implies {@see document.querySelector()}, and returns an element.
 *   - Passing `selectors` as an array implies {@see document.querySelectorAll()}, and returns a {@see NodeList}.
 *
 * @requiredEnv web
 */
export function query<Type extends keyof HTMLElementTagNameMap>(selectors: Type): HTMLElementTagNameMap[Type] | null;
export function query<Type extends keyof HTMLElementTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementTagNameMap[Type]>;

export function query<Type extends keyof SVGElementTagNameMap>(selectors: Type): SVGElementTagNameMap[Type] | null;
export function query<Type extends keyof SVGElementTagNameMap>(selectors: Type[]): NodeListOf<SVGElementTagNameMap[Type]>;

export function query<Type extends keyof MathMLElementTagNameMap>(selectors: Type): MathMLElementTagNameMap[Type] | null;
export function query<Type extends keyof MathMLElementTagNameMap>(selectors: Type[]): NodeListOf<MathMLElementTagNameMap[Type]>;

export function query<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type): HTMLElementDeprecatedTagNameMap[Type] | null;
export function query<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementDeprecatedTagNameMap[Type]>;

export function query<Type extends Element = Element>(selectors: string): Type | null;
export function query<Type extends Element = Element>(selectors: string[]): NodeListOf<Type>;

export function query<Type extends Element = Element, Selectors extends string[] | string = string>(
    selectors: Selectors,
): Selectors extends string[] ? NodeListOf<Type> : Type | null {
    type RtnType = Selectors extends string[] ? NodeListOf<Type> : Type | null;

    if ($is.array(selectors)) {
        return document.querySelectorAll(selectors.join(', ')) as RtnType;
    }
    return document.querySelector(selectors) as RtnType;
}

/**
 * Requires DOM element(s).
 *
 * @param   selectors Selectors. Comma-delimited string or array.
 *
 * @returns           An {@see Element|NodeListOf<Element>}; else throws error.
 *
 *   - Passing `selectors` as a string implies {@see document.querySelector()}, and returns an element.
 *   - Passing `selectors` as an array implies {@see document.querySelectorAll()}, and returns a {@see NodeList}.
 *
 * @requiredEnv web
 */
export function require<Type extends keyof HTMLElementTagNameMap>(selectors: Type): HTMLElementTagNameMap[Type];
export function require<Type extends keyof HTMLElementTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementTagNameMap[Type]>;

export function require<Type extends keyof SVGElementTagNameMap>(selectors: Type): SVGElementTagNameMap[Type];
export function require<Type extends keyof SVGElementTagNameMap>(selectors: Type[]): NodeListOf<SVGElementTagNameMap[Type]>;

export function require<Type extends keyof MathMLElementTagNameMap>(selectors: Type): MathMLElementTagNameMap[Type];
export function require<Type extends keyof MathMLElementTagNameMap>(selectors: Type[]): NodeListOf<MathMLElementTagNameMap[Type]>;

export function require<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type): HTMLElementDeprecatedTagNameMap[Type];
export function require<Type extends keyof HTMLElementDeprecatedTagNameMap>(selectors: Type[]): NodeListOf<HTMLElementDeprecatedTagNameMap[Type]>;

export function require<Type extends Element = Element>(selectors: string): Type;
export function require<Type extends Element = Element>(selectors: string[]): NodeListOf<Type>;

export function require<Type extends Element = Element, Selectors extends string[] | string = string>(selectors: Selectors): Selectors extends string[] ? NodeListOf<Type> : Type {
    type RtnType = Selectors extends string[] ? NodeListOf<Type> : Type;
    let rtnValue; // Initialize.

    if ($is.array(selectors)) {
        rtnValue = document.querySelectorAll(selectors.join(', '));
        rtnValue = rtnValue.length ? rtnValue : null;
    } else rtnValue = document.querySelector(selectors);

    if (!rtnValue /* Cannot be an empty node list, either. */) {
        throw new Error('DOM query failed on: `' + $to.array(selectors).join(', ') + '`.');
    }
    return rtnValue as RtnType;
}

/**
 * Gets computed styles of a required DOM element.
 *
 * @param   selectors Selectors. Comma-delimited string, or an existing {@see Element}.
 *
 * @returns           A computed {@see CSSStyleDeclaration}.
 *
 * @requiredEnv web
 */
export const stylesOf = (selectors: string | Element): CSSStyleDeclaration => {
    return getComputedStyle($is.element(selectors) ? selectors : require(selectors));
};
