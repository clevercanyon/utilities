/**
 * Test suite.
 */

import { $dom } from '#index.ts';
import { describe, expect, test, vi } from 'vitest';

describe('$dom', async () => {
    test('.onReady()', async () => {
        const fn = vi.fn();
        $dom.onReady(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });
    test('.onLoad()', async () => {
        const fn = vi.fn();
        $dom.onLoad(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });
    test('.onNextFrame()', async () => {
        const fn = vi.fn();
        $dom.onNextFrame(fn);

        await new Promise((resolve) => {
            setTimeout(() => {
                expect(fn).toHaveBeenCalledTimes(1);
                resolve(true);
            }, 100);
        });
    });
    test('.afterNextFrame()', async () => {
        const fn = vi.fn();
        $dom.afterNextFrame(fn);

        await new Promise((resolve) => {
            setTimeout(() => {
                expect(fn).toHaveBeenCalledTimes(1);
                resolve(true);
            }, 100);
        });
    });
    test('.on(body, click), .trigger()', async () => {
        const fn = vi.fn();
        const eventTools = $dom.on(document, 'click', fn);

        $dom.body().click(); // Bubbles.
        $dom.trigger($dom.body(), 'x:click'); // Does not bubble.

        eventTools.cancel(); // Removes listener.

        $dom.body().click(); // Bubbles.
        $dom.trigger($dom.body(), 'x:click'); // Does not bubble.

        expect(fn).toHaveBeenCalledTimes(1);
    });
    test('.on(body, click x:click), .trigger()', async () => {
        const fn1 = vi.fn();
        const eventTools1 = $dom.on($dom.body(), 'click x:click', fn1);

        $dom.body().click(); // Bubbles.
        $dom.trigger($dom.body(), 'x:click'); // Does not bubble.

        eventTools1.cancel(); // Removes listener.

        $dom.body().click(); // Bubbles.
        $dom.trigger($dom.body(), 'x:click'); // Does not bubble.

        expect(fn1).toHaveBeenCalledTimes(2);

        // ---

        const fn2 = vi.fn();
        const eventTools2 = $dom.on($dom.body(), ['click', 'x:click'], fn2);

        $dom.body().click(); // Bubbles.
        $dom.trigger($dom.body(), 'x:click'); // Does not bubble.

        eventTools2.cancel(); // Removes listener.

        $dom.body().click(); // Bubbles.
        $dom.trigger($dom.body(), 'x:click'); // Does not bubble.

        expect(fn2).toHaveBeenCalledTimes(2);

        // ---

        const fn3 = vi.fn();
        const eventTools3 = $dom.on($dom.body(), ['click', 'x:click'], fn2);

        eventTools3.cancel(); // Removes listener.

        $dom.body().click(); // Bubbles.
        $dom.trigger($dom.body(), 'x:click'); // Does not bubble.

        expect(fn3).toHaveBeenCalledTimes(0);
    });
    test('.on(body, click, selectors), .trigger()', async () => {
        const fn1 = vi.fn();
        $dom.on(document, 'click', 'body > a', fn1);

        $dom.body().appendChild($dom.create('a', { href: '#one' }));
        $dom.body().appendChild($dom.create('a', { href: '#two' }));

        ($dom.require('body > a[href="#one"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#one"]'), 'x:click'); // Does not bubble.

        ($dom.require('body > a[href="#two"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#two"]'), 'x:click'); // Does not bubble.

        expect(fn1).toHaveBeenCalledTimes(2);

        // ---

        const fn2 = vi.fn();
        $dom.on(document, 'click', 'body', fn2);

        $dom.body().appendChild($dom.create('a', { href: '#one' }));
        $dom.body().appendChild($dom.create('a', { href: '#two' }));

        ($dom.require('body > a[href="#one"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#one"]'), 'x:click'); // Does not bubble.

        ($dom.require('body > a[href="#two"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#two"]'), 'x:click'); // Does not bubble.

        expect(fn2).toHaveBeenCalledTimes(2);

        // ---

        const fn3 = vi.fn();
        $dom.on(document, 'click', 'body > nonexistent', fn3);

        $dom.body().appendChild($dom.create('a', { href: '#one' }));
        $dom.body().appendChild($dom.create('a', { href: '#two' }));

        ($dom.require('body > a[href="#one"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#one"]'), 'x:click'); // Does not bubble.

        ($dom.require('body > a[href="#two"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#two"]'), 'x:click'); // Does not bubble.

        expect(fn3).toHaveBeenCalledTimes(0);
    });
    test('.on(body, click x:click, selectors), .trigger()', async () => {
        const fn1 = vi.fn();
        $dom.on(document, 'click x:click', 'body > a', fn1);

        $dom.body().appendChild($dom.create('a', { href: '#one' }));
        $dom.body().appendChild($dom.create('a', { href: '#two' }));

        ($dom.require('body > a[href="#one"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#one"]'), 'x:click'); // Does not bubble.

        ($dom.require('body > a[href="#two"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#two"]'), 'x:click'); // Does not bubble.

        expect(fn1).toHaveBeenCalledTimes(2);

        // ---

        const fn2 = vi.fn();
        $dom.on(document, 'click x:click', 'body > a[href="#one"]', fn2);

        $dom.body().appendChild($dom.create('a', { href: '#one' }));
        $dom.body().appendChild($dom.create('a', { href: '#two' }));

        ($dom.require('body > a[href="#one"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#one"]'), 'x:click'); // Does not bubble.

        ($dom.require('body > a[href="#two"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#two"]'), 'x:click'); // Does not bubble.

        expect(fn2).toHaveBeenCalledTimes(1);

        // ---

        const fn3 = vi.fn();
        $dom.on(document, ['click', 'x:click'], 'body > a[href="#one"], body > a[href="#two"]', fn3);

        $dom.body().appendChild($dom.create('a', { href: '#one' }));
        $dom.body().appendChild($dom.create('a', { href: '#two' }));

        ($dom.require('body > a[href="#one"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#one"]'), 'x:click', {}, { bubbles: true }); // Bubbles.

        ($dom.require('body > a[href="#two"]') as unknown as HTMLAnchorElement).click(); // Bubbles.
        $dom.trigger($dom.require('body > a[href="#two"]'), 'x:click', {}, { bubbles: true }); // Bubbles.

        expect(fn3).toHaveBeenCalledTimes(4);
    });
    test('.headAppend()', async () => {
        $dom.headAppend($dom.create('meta', { name: 'foo', content: 'bar' }));
        expect($dom.query('head > meta[name=foo]') instanceof HTMLMetaElement).toBe(true);
    });
    test('.bodyAppend()', async () => {
        $dom.bodyAppend($dom.create('p', { class: 'foo' }));
        expect($dom.query('body > p.foo') instanceof HTMLParagraphElement).toBe(true);
    });
    test('.appendStyle()', async () => {
        $dom.appendStyle('./style.css', { id: 'style' });
        expect($dom.query('head > link[href="./style.css"]') instanceof HTMLLinkElement).toBe(true);
    });
    test('.appendScript()', async () => {
        $dom.appendScript('./script.js', { id: 'script', nonce: 'xnonce' });
        expect($dom.query('head > script[src="./script.js"]') instanceof HTMLScriptElement).toBe(true);
    });
    test('.appendModule()', async () => {
        $dom.appendModule('./script.js', { id: 'module' });
        expect($dom.query('head > script[src="./script.js"][type=module]') instanceof HTMLScriptElement).toBe(true);
    });
    test('.newAtts(), .setAtts()', async () => {
        const xTest = $dom.create('x-test', { id: 'x-test', 'data-bar': 'bar', 'data-baz': 'baz' });
        expect(xTest.getAttribute('id')).toBe('x-test');
        expect(xTest.getAttribute('data-bar')).toBe('bar');

        $dom.require('body').appendChild(xTest);
        expect(xTest.getAttribute('id')).toBe('x-test');
        expect(xTest.getAttribute('data-bar')).toBe('bar');

        $dom.newAtts(xTest, { id: 'x-test-new', 'data-foo': 'foo', 'data-bar': undefined });
        expect($dom.query('body > x-test[id=x-test-new][data-foo=foo]') instanceof HTMLElement).toBe(true);
        expect(xTest.getAttribute('id')).toBe('x-test-new');
        expect(xTest.getAttribute('data-foo')).toBe('foo');
        expect(xTest.getAttribute('data-bar')).toBe(null);
        expect(xTest.getAttribute('data-baz')).toBe(null);
    });
});
