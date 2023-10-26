/**
 * Test suite.
 */

import { describe, expect, test, vi } from 'vitest';
import { $dom } from '../../index.ts';

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
    test('.on(click)', async () => {
        const fn = vi.fn();
        $dom.on('click', fn);
        $dom.require('body').click();
        expect(fn).toHaveBeenCalledTimes(1);
    });
    test('.on(click, selectors)', async () => {
        const fn1 = vi.fn();
        $dom.on('click', 'body > a', fn1);
        $dom.require('body').appendChild($dom.create('a', { href: '#' }));
        ($dom.require('body > a') as unknown as HTMLAnchorElement).click();
        expect(fn1).toHaveBeenCalledTimes(1);

        const fn2 = vi.fn();
        $dom.on('click', 'body > x', fn2);
        $dom.require('body').appendChild($dom.create('a', { href: '#' }));
        ($dom.require('body > a') as unknown as HTMLAnchorElement).click();
        expect(fn2).toHaveBeenCalledTimes(0);
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
        $dom.appendScript('./script.js', { id: 'script' });
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