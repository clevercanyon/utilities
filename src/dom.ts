/**
 * DOM utilities.
 */

import './resources/init.ts';

import { $env, $is, $to, type $type } from './index.ts';

/**
 * Fires a callback on document ready state.
 *
 * @param callback Callback.
 */
export const onReady = (callback: () => void): void => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;

    if ('loading' !== document.readyState) {
        callback(); // Fires callback immediately.
    } else {
        document.addEventListener('DOMContentLoaded', () => callback());
    }
};

/**
 * Fires a callback on window loaded state.
 *
 * @param callback Callback.
 */
export const onLoad = (callback: () => void): void => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;

    if ('complete' === document.readyState) {
        callback(); // Fires callback immediately.
    } else {
        window.addEventListener('load', () => callback());
    }
};

/**
 * Fires a callback on the next frame.
 *
 * @param callback Callback.
 */
export const onNextFrame = (callback: () => void): void => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    requestAnimationFrame(callback);
};

/**
 * Fires a callback after the next frame.
 *
 * Callback is invoked after the browser has a painted a new frame. We accomplish this by combining use of the very
 * popular {@see requestAnimationFrame} (RAF) with {@see setTimeout()} (timeout) to invoke a callback after the next
 * frame. Additionally, we schedule a timeout in parallel to rAF to ensure the callback is invoked even if RAF doesn't
 * fire; e.g., if the browser tab is not visible.
 *
 * @param callback Callback.
 */
export const afterNextFrame = (callback: () => void): void => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;

    const done = () => {
        clearTimeout(timeout);
        cancelAnimationFrame(raf);
        setTimeout(callback);
    };
    const timeout = setTimeout(done, 100);
    const raf = requestAnimationFrame(done);
};

/**
 * Fires a callback on a named event.
 *
 * @param eventName Event name. Required always.
 * @param selectors Selectors for delegated events.
 * @param callback  Callback for event handler.
 */
export function on(eventName: string, callback: (x: Event) => void): void;
export function on(eventName: string, selectors: string, callback: (x: Event) => void): void;

export function on(...args: unknown[]): void {
    if (!$env.isWeb()) throw $env.errClientSideOnly;

    const eventName = args[0] as string;
    let selectors: string; // Initialize.
    let callback: (x: Event) => void;

    if (args.length >= 3) {
        selectors = args[1] as typeof selectors;
        callback = args[2] as typeof callback;
    } else {
        selectors = '' as typeof selectors;
        callback = args[1] as typeof callback;
    }
    if (selectors && callback) {
        document.addEventListener(eventName, (event: Event): void => {
            let target = event.target;

            if (!(target instanceof Element)) {
                return; // Not applicable.
            }
            do {
                if (target.matches(selectors)) {
                    callback.call(target, event);
                }
            } while ((target = target.parentNode) instanceof Element && target !== event.currentTarget);
        });
    } else document.addEventListener(eventName, callback);
}

/**
 * Appends an element to `<head>`.
 *
 * @param element Element to attach.
 */
export const headAppend = (element: Element): void => {
    require('head').appendChild(element);
};

/**
 * Appends an element to `<body>`.
 *
 * @param element Element to attach.
 */
export const bodyAppend = (element: Element): void => {
    require('body').appendChild(element);
};

/**
 * Appends a `<link rel="stylesheet" media="all">` to `<head>`.
 *
 * @param href  Stylesheet source.
 * @param attrs Optional attributes.
 *
 *   - Attributes may override default `rel`, `media` if necessary.
 */
export const appendStyle = (href: string, attrs: Partial<HTMLLinkElement> = {}): void => {
    headAppend(create('link', { rel: 'stylesheet', media: 'all', ...attrs, href }));
};

/**
 * Appends a `<script async>` to `<head>`.
 *
 * @param src   Script source.
 * @param attrs Optional attributes.
 *
 *   - Attributes may override default `async` if necessary.
 */
export const appendScript = (src: string, attrs: Partial<HTMLScriptElement> = {}): void => {
    headAppend(create('script', { async: true, ...attrs, src }));
};

/**
 * Appends a `<script type="module">` to `<head>`.
 *
 * @param src   Script source.
 * @param attrs Optional attributes.
 *
 *   - Attributes may override default `type` if necessary.
 */
export const appendModule = (src: string, attrs: Partial<HTMLScriptElement> = {}): void => {
    headAppend(create('script', { type: 'module', ...attrs, src }));
};

/**
 * Create a new HTML element.
 *
 * @param   tag   HTML tag name.
 * @param   attrs Optional attributes.
 *
 * @returns       HTML element; {@see HTMLElement}.
 */
export const create = (tag: string, attrs?: $type.Object): HTMLElement => {
    const element = document.createElement(tag);
    const attrEntries = Object.entries(attrs || {});

    for (const [, value] of attrEntries) {
        if ($is.function(value))
            // @ts-ignore -- Readonly warning OK to ignore.
            element[attr as keyof Element] = value;
    }
    for (const [name, value] of attrEntries) {
        if (true === value) {
            element.setAttribute(name, '');
        } else if ($is.string(value) || $is.number(value)) {
            element.setAttribute(name, String(value));
        }
    }
    return element;
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
    //
    if (!$env.isWeb()) throw $env.errClientSideOnly;
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
    if (!$env.isWeb()) throw $env.errClientSideOnly;
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
 */
export const stylesOf = (selectors: string | Element): CSSStyleDeclaration => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return window.getComputedStyle(selectors instanceof Element ? selectors : require(selectors));
};
