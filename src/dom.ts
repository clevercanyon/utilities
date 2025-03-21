/**
 * DOM utilities.
 *
 * @requiredEnv web
 */

import '#@initialize.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $fn, $is, $obj, $preact, $to, type $type } from '#index.ts';
import { finder as buildCSSSelector } from '@medv/finder';

/**
 * Tracks wheel status.
 */
let userIsWheeling = false;
let initializedWheelStatus = false;

/**
 * Defines types.
 */
export type PathToOptions = { from?: Element };

/**
 * Initializes wheel status.
 *
 * Why do we have this and why is {@see $dom.onWheelEnd()} helpful? When a mouse wheel is used for scrolling it can
 * reach the bottom of a page and then continue turning; e.g., MX Revolution mice tend to do this. In such a case, upon
 * reaching the bottom of a page, wheeling ceases to be a `scroll` event; i.e., `scroll`, `scrollend` events are no
 * longer fired because there is nothing left to scroll on the page, so browsers just ignore the wheeling altogether.
 *
 * However, if the page content changes, or the scroll position changes programmatically, and the wheel happens to still
 * be turning, then it’s possible it could start firing residual `scroll`, `scrollend` events again, which yields a very
 * confusing situation for a user when residual scrolling is mixed with programmatic scrolling.
 */
const initializeWheelStatus = (): void => {
    if (initializedWheelStatus) return;
    initializedWheelStatus = true;

    let wheelTimeout: $type.Timeout;

    const onWheel = $fn.throttle(
        (): void => {
            clearTimeout(wheelTimeout);
            userIsWheeling = true; // Wheeling.
            wheelTimeout = setTimeout(onWheelEnd, 300);
        },
        { edge: 'leading', waitTime: 250 }, // Must be less than `300`.
    );
    const onWheelEnd = (): void => {
        onWheel.cancel();
        userIsWheeling = false;
        trigger(window, 'x:wheelEnd');
    };
    on(window, 'wheel', onWheel, { passive: true });
};

/**
 * Fires a callback on document ready state.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see $type.DOMEventTools}.
 */
export const onReady = (callback: $type.AnyVoidFunction): $type.DOMEventTools => {
    const eventName = 'DOMContentLoaded';
    const actualCallback = (): void => void callback();

    if ('loading' !== document.readyState) {
        actualCallback(); // Fires callback immediately.
    } else {
        addEventListener(eventName, actualCallback, { passive: true, once: true });
    }
    return { cancel: (): void => removeEventListener(eventName, actualCallback) };
};

/**
 * Fires a callback on window loaded state.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see $type.DOMEventTools}.
 */
export const onLoad = (callback: $type.AnyVoidFunction): $type.DOMEventTools => {
    const eventName = 'load';
    const actualCallback = (): void => void callback();

    if ('complete' === document.readyState) {
        actualCallback(); // Fires callback immediately.
    } else {
        addEventListener(eventName, actualCallback, { passive: true, once: true });
    }
    return { cancel: (): void => removeEventListener(eventName, actualCallback) };
};

/**
 * Fires a callback after user stops wheeling.
 *
 * Why do we have this and why is {@see $dom.onWheelEnd()} helpful? When a mouse wheel is used for scrolling it can
 * reach the bottom of a page and then continue turning; e.g., MX Revolution mice tend to do this. In such a case, upon
 * reaching the bottom of a page, wheeling ceases to be a `scroll` event; i.e., `scroll`, `scrollend` events are no
 * longer fired because there is nothing left to scroll on the page, so browsers just ignore the wheeling altogether.
 *
 * However, if the page content changes, or the scroll position changes programmatically, and the wheel happens to still
 * be turning, then it’s possible it could start firing residual `scroll`, `scrollend` events again, which yields a very
 * confusing situation for a user when residual scrolling is mixed with programmatic scrolling.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see $type.DOMEventTools}.
 */
export const onWheelEnd = (callback: $type.AnyVoidFunction): $type.DOMEventTools => {
    initializeWheelStatus(); // If not already.

    const eventName = 'x:wheelEnd';
    const actualCallback = (): void => void callback();

    if (!userIsWheeling) {
        actualCallback(); // Fires callback immediately.
    } else {
        addEventListener(eventName, actualCallback, { passive: true, once: true });
    }
    return { cancel: (): void => removeEventListener(eventName, actualCallback) };
};

/**
 * Fires a callback on the next frame.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see $type.DOMEventTools}.
 */
export const onNextFrame = (callback: $type.AnyVoidFunction): $type.DOMEventTools => {
    const raf = requestAnimationFrame((): void => void callback());
    return { cancel: (): void => cancelAnimationFrame(raf) };
};

/**
 * Fires a callback after the next frame.
 *
 * Callback is invoked after the browser has a painted a new frame. We accomplish this by combining use of RAF; i.e.,
 * {@see requestAnimationFrame()} together with {@see setTimeout()} to invoke a callback after the next frame. A timeout
 * is scheduled in parallel to ensure the callback is always invoked; e.g., if the browser tab is not visible.
 *
 * @param   callback Callback.
 *
 * @returns          Event tools; {@see $type.DOMEventTools}.
 */
export const afterNextFrame = (callback: $type.AnyVoidFunction): $type.DOMEventTools => {
    const done = (): void => {
        clearTimeout(timeout);
        cancelAnimationFrame(raf);
        setTimeout((): void => void callback());
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
 * @param   targetSelectors Window, document, element, or selectors.
 * @param   eventNames      Event name(s). Space-separated string or array.
 * @param   selectors       Optional selectors. If given, `callback` and `options` shift to new positions and a
 *   delegated event handler is configured instead of a regular event handler. Selectors = delegated event handler.
 * @param   callback        Callback for event handler.
 * @param   options         Options (all optional); {@see AddEventListenerOptions}.
 *
 * @returns                 Event tools; {@see $type.DOMEventTools}.
 */
export function on(
    targetSelectors: $type.DOMEventTargetSelectors,
    eventNames: string | string[],
    callback: $type.DOMEventHandler,
    options?: AddEventListenerOptions,
): $type.DOMEventTools;

export function on(
    targetSelectors: $type.DOMEventTargetSelectors,
    eventNames: string | string[],
    selectors: string,
    callback: $type.DOMEventHandler,
    options?: AddEventListenerOptions,
): $type.DOMEventTools;

export function on(...args: unknown[]): $type.DOMEventTools {
    const targetSelectors = args[0] as $type.DOMEventTargetSelectors;
    const target = $is.string(targetSelectors) ? require(targetSelectors) : targetSelectors;

    const cancelers: (() => void)[] = []; // Initialize.
    const eventNames = $to.array(args[1]).join(' ').split(/\s+/u);

    let selectors = '';
    let actualCallback: (event: Event) => void;
    let callback: ((event: Event) => void) | ((event: Event) => Promise<void>);
    let options: AddEventListenerOptions | undefined; // Optional listener options.

    if ($is.function(args[3]) /* Selectors are given for delegated event handler? */) {
        [, , selectors, callback, options] = args as [0, 0, typeof selectors, typeof callback, typeof options];
    } else [, , callback, options] = args as [0, 0, typeof callback, typeof options];

    if (selectors && callback /* Selectors are given for delegated event handler? */) {
        actualCallback = (event: Event): void => {
            let { currentTarget, target } = event;
            if (!$is.element(target)) return;
            do {
                if (target.matches(selectors)) void callback.call(target, new CustomEvent(event.type, { detail: { target, event } }));
            } while ($is.element((target = target.parentNode)) && target !== currentTarget);
        };
    } else actualCallback = (event: Event): void => void callback.call(event.target, event);

    for (const eventName of eventNames) {
        if (!eventName) throw Error('KvYQ3ufQ'); // Missing event name.
        target.addEventListener(eventName, actualCallback, options);
        cancelers.push((): void => target.removeEventListener(eventName, actualCallback, options));
    }
    return { cancel: (): void => cancelers.forEach((cancel) => cancel()) };
}

/**
 * Triggers a custom event.
 *
 * @param targetSelectors Window, document, element, or selectors.
 * @param event           Name of a custom event, {@see CustomEvent}, or {@see Event}.
 * @param data            For a custom event, optional data to pass as `detail` to listeners.
 * @param options         For a custom event, optional initialization options; {@see CustomEventInit}.
 */
export const trigger = (targetSelectors: $type.DOMEventTargetSelectors, event: string | CustomEvent | Event, data?: object, options?: CustomEventInit): void => {
    const target = $is.string(targetSelectors) ? require(targetSelectors) : targetSelectors;
    if ($is.string(event)) event = new CustomEvent(event, { detail: data || {}, ...options });
    target.dispatchEvent(event);
};

/**
 * Appends an element to `<head>`.
 *
 * @param element Element to attach.
 */
export const headAppend = (element: Element): void => {
    head().appendChild(element);
};

/**
 * Appends an element to `<body>`.
 *
 * @param element Element to attach.
 */
export const bodyAppend = (element: Element): void => {
    body().appendChild(element);
};

/**
 * Appends a `<link rel="stylesheet" media="all">` to `<head>`.
 *
 * @param href Stylesheet source.
 * @param atts Optional attributes.
 *
 *   - Attributes may override default `rel`, `media` if necessary.
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
 */
export const appendScript = (src: string, atts: Partial<HTMLScriptElement> = {}): void => {
    headAppend(create('script', { async: '', ...atts, src }));
};

/**
 * Appends a `<script type="module">` to `<head>`.
 *
 * @param src  Script source.
 * @param atts Optional attributes.
 *
 *   - Attributes may override default `type` if necessary.
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
 */
export function create(tag: 'fragment'): DocumentFragment;
export function create(tag: 'textNode', value?: $type.Primitive): Text;
export function create<Tag extends keyof HTMLElementTagNameMap>(tag: Tag, atts?: Partial<HTMLElementTagNameMap[Tag]>): HTMLElementTagNameMap[Tag];
export function create<Tag extends keyof SVGElementTagNameMap>(tag: Tag, atts?: Partial<SVGElementTagNameMap[Tag]>): SVGElementTagNameMap[Tag];
export function create<Tag extends keyof MathMLElementTagNameMap>(tag: Tag, atts?: Partial<MathMLElementTagNameMap[Tag]>): MathMLElementTagNameMap[Tag];
export function create<Tag extends keyof HTMLElementDeprecatedTagNameMap>(tag: Tag, atts?: Partial<HTMLElementDeprecatedTagNameMap[Tag]>): HTMLElementDeprecatedTagNameMap[Tag];
export function create(tag: string, atts?: $type.DOMAtts): Element;

export function create(...args: unknown[]): DocumentFragment | Text | Element {
    const tag = (args[0] as string).toLowerCase();
    let value: $type.Primitive | undefined, atts: $type.DOMAtts | undefined;

    if ('fragment' === tag) {
        return document.createDocumentFragment();
        //
    } else if ('textNode' === tag) {
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
 */
export const newAtts = (element: Element, atts: $type.DOMAtts): void => {
    // Cast as keyable so we can access properties.
    const elementObj = element as $type.Object<Element>;

    // These caSe-sensitive names should only be unset as properties, not as attributes.
    for (const name of ['nonce']) if (name in elementObj && !Object.hasOwn(atts, name))
        try { elementObj[name] = ''; } catch {} // prettier-ignore

    // These caSe-insensitive names should only be unset as properties, not as attributes.
    for (const name in elementObj)
        if (name.startsWith('on') && null !== elementObj[name]) {
            elementObj[name] = null; // Nullifies event handler.
        }
    // Everything else uses caSe-insensitive names via `element.*Attribute()` functions.
    for (let i = 0; i < element.attributes.length; i++) {
        const { name } = element.attributes[i];
        if (!Object.hasOwn(atts, name)) element.removeAttribute(name);
    }
    setAtts(element, atts);
};

/**
 * Sets an element’s attributes.
 *
 * This utility is one that sets arbitrary attributes for any element type. Thus, we use an intentionally loose type for
 * `atts`, as we prefer to avoid colliding with any type validations that have already occurred higher up in the call
 * stack; e.g., in a more element-specific context. A few points worth noting are as follows:
 *
 * - `innerText`, `children` will set `innerText`. While not an attribute, we do support it here.
 * - `innerHTML`, `dangerouslySetInnerHTML` will set `innerHTML`. While not an attribute, we do support it here.
 * - Attributes set as `null` or `undefined` will be removed entirely. `false` is also a removal signal, but only for
 *   non-data attributes, which aligns this utility with preact so we aren’t creating a new way of doing things.
 * - Also like preact, attributes set to `true` are stringified as `'true'`, no different from `.setAttribute()`.
 * - Worth noting this also supports `on*` properties with function values; e.g., `onload`, `onclick`, etc.
 * - In all cases, attributes that already exist with the same value will not be set and/or removed again.
 *
 * Note: This does not officially support 'properties' or the full array of all features that preact does. It is
 * explicitly limited to setting attributes, and specific properties: `innerText`, `innerHTML`, `on[event]` only. It
 * also does not support `style` being passed as an object like preact does, only as a string. With respect to preact,
 * the goal here is to provide the right balance of preact compatibility, such that we can update the DOM by passing
 * this utility intrinsic component props, but not to get so carried away that we try to support every single thing
 * preact does. Also, keep in mind this general purpose DOM utility is sometimes used outside of a preact context.
 *
 * @param element Element.
 * @param atts    Attributes.
 *
 * @see https://o5p.me/IzTGcl Preact source code.
 */
export const setAtts = (element: Element, atts: $type.DOMAtts): void => {
    // Cast as keyable so we can access properties.
    const elementObj = element as $type.Object<Element>;

    // Removes internal preact props, which are not real attributes.
    // We don’t, however, remove `children`, because there are cases in which we can handle below.
    atts = $obj.omit(atts, ['ref', 'key']); // `dangerouslySetInnerHTML` is also handled below.

    // Consolidates class prop variants into a single `class` attribute.
    if ($preact.classPropVariants().some((variant) => Object.hasOwn(atts, variant))) {
        atts = { ...$preact.omitProps(atts, ['class']), class: $preact.classes(atts) };
    }
    // Iterates all new attribute names/values.
    for (let [name, newValue] of Object.entries(atts)) {
        let lcName: string; // Might be needed and defined below.

        // These caSe-sensitive names should only be set as properties, not as attributes.
        if (['innerText', 'children'].includes(name)) {
            if (!$is.primitive(newValue)) throw Error('UTVWT5J9');
            const newStrValue = $to.string(newValue);

            if (elementObj.innerText !== newStrValue) {
                elementObj.innerText = newStrValue;
            }
            // These caSe-sensitive names should only be set as properties, not as attributes.
        } else if (['innerHTML', 'dangerouslySetInnerHTML'].includes(name)) {
            if ($is.object(newValue)) newValue = newValue.__html;
            const newStrValue = $to.string(newValue);

            if (elementObj.innerHTML !== newStrValue) {
                elementObj.innerHTML = newStrValue;
            }
            // These caSe-sensitive names should only be set as properties, not as attributes.
        } else if (['nonce'].includes(name) && name in elementObj) {
            if (elementObj[name] !== newValue) elementObj[name] = newValue;
            //
            // These caSe-insensitive names should only be set as properties, not as attributes.
        } else if ((lcName = name.toLowerCase()).startsWith('on') && lcName in elementObj) {
            if (elementObj[lcName] !== newValue) elementObj[lcName] = newValue;
            //
            // Everything else uses caSe-insensitive names via `element.*Attribute()` functions.
        } else {
            const currentValue = element.getAttribute(name);

            if ($is.nul(newValue) || (false === newValue && '-' !== name[4])) {
                // Mimics preact; i.e., `false` is only a removal signal on non-data attributes.
                // Technically, not `data-`, but `????-`, which is almost sure to be `data-`.
                if (null !== currentValue) element.removeAttribute(name);
                //
            } /* Anything else, including `true`, is stringified here. */ else {
                // Mimics preact; i.e., boolean `true` is stringified as `'true'`.
                const newStrValue = $to.string(newValue); // e.g., `'true'`, URL, Time, etc.
                if (currentValue !== newStrValue) element.setAttribute(name, newStrValue);
            }
        }
    }
};

/**
 * Caches `<html>` element for each reuse.
 *
 * @returns HTML element; {@see HTMLHtmlElement}.
 */
export const html = $fnꓺmemo((): HTMLHtmlElement => require('html'));

/**
 * Caches `<head>` element for each reuse.
 *
 * @returns Head element; {@see HTMLHeadElement}.
 */
export const head = $fnꓺmemo((): HTMLHeadElement => require('head'));

/**
 * Caches `<body>` element for each reuse.
 *
 * @returns Body element; {@see HTMLBodyElement}.
 */
export const body = $fnꓺmemo((): HTMLBodyElement => require('body'));

/**
 * Caches `<x-preact-app>` element for each reuse.
 *
 * @returns Element; {@see HTMLElement}, else `null` if not present in DOM.
 */
export const xPreactApp = $fnꓺmemo((): HTMLElement | null => query('body > x-preact-app'));

/**
 * Queries DOM element(s).
 *
 * @param   selectors Selectors. Comma-delimited string or array.
 *
 * @returns           An {@see Element|NodeListOf<Element>}; else `null`.
 *
 *   - Passing `selectors` as a string implies {@see document.querySelector()}, and returns an element.
 *   - Passing `selectors` as an array implies {@see document.querySelectorAll()}, and returns a {@see NodeList}.
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
        throw Error('2BQgcWpj'); // DOM query failed on: `' + $to.array(selectors).join(', ') + '`.
    }
    return rtnValue as RtnType;
}

/**
 * Gets computed styles of a required DOM element.
 *
 * @param   selectors Selectors. Comma-delimited string, or an existing {@see Element}.
 *
 * @returns           A computed {@see CSSStyleDeclaration}.
 */
export const stylesOf = (selectors: string | Element): CSSStyleDeclaration => {
    return getComputedStyle($is.string(selectors) ? require(selectors) : selectors);
};

/**
 * Gets selector path leading to a given element in the DOM.
 *
 * @param   element An {@see Element} in the DOM.
 * @param   options Options (all optional); {@see PathToOptions}.
 *
 * @returns         Selector path leading to a given element in the DOM.
 */
export const pathTo = (element: Element, options?: PathToOptions): string => {
    const opts = $obj.defaults({}, options || {}) as Required<PathToOptions>;
    return $fn.try(
        (): string =>
            buildCSSSelector(element, {
                root: opts.from || xPreactApp() || body(),
            }),
        '',
    )();
};
