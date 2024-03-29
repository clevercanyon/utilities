/**
 * Test suite.
 */

import { $http, $redact, $user } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$redact', async () => {
    test('.string()', async () => {
        expect($redact.string('')).toBe('');
        expect($redact.string('x')).toBe('*');
        expect($redact.string('xx')).toBe('**');
        expect($redact.string('xxx')).toBe('x*x');
        expect($redact.string('xxxx')).toBe('x**x');
        expect($redact.string('xxxxx')).toBe('x***x');
        expect($redact.string('xxxxxx')).toBe('x****x');
        expect($redact.string('xxxxxxx')).toBe('x*****x');
        expect($redact.string('xxxxxxxx')).toBe('x******x');
        expect($redact.string('xxxxxxxxx')).toBe('xxx***xxx');
        expect($redact.string('xxxxxxxxxx')).toBe('xxx****xxx');
    });
    test('.url()', async () => {
        expect($redact.url('https://x.tld/')).toBe('https://x.tld/');
        expect($redact.url(new URL('https://x.tld/'))).toBeInstanceOf(URL);
        expect($redact.url(new URL('https://x.tld/')).toString()).toBe('https://x.tld/');

        expect($redact.url('https://x.tld/?foo=bar&utm_source=test')).toBe('https://x.tld/?foo=b*r&utm_source=test');
        expect($redact.url('https://x.tld/?foo=hello+world&utm_source=test')).toBe('https://x.tld/?foo=hel*****rld&utm_source=test');
    });
    test('.object()', async () => {
        expect(
            $redact.object({
                Ja9nYEdM: 'VPKyC6MA6QgSUzb6',
                JfSpKvup: 'fA6FZwgJqYAMwHSk',
                yPT7xnUp: 'qjrXFZZwc9Xnkpw6',
                wfT6rFaz: {
                    Ja9nYEdM: 'VPKyC6MA6QgSUzb6',
                    JfSpKvup: 'fA6FZwgJqYAMwHSk',
                    yPT7xnUp: 'qjrXFZZwc9Xnkpw6',
                },
                xDAjTeek: {
                    Ja9nYEdM: ['VPKyC6MA6QgSUzb6'],
                    JfSpKvup: new Set(['fA6FZwgJqYAMwHSk']),
                    yPT7xnUp: new Map([[0, 'qjrXFZZwc9Xnkpw6']]),
                    wfT6rFaz: {
                        Ja9nYEdM: 'VPKyC6MA6QgSUzb6',
                        JfSpKvup: 'fA6FZwgJqYAMwHSk',
                        yPT7xnUp: 'qjrXFZZwc9Xnkpw6',
                    },
                },
            }),
        ).toStrictEqual({
            Ja9nYEdM: 'VPK**********zb6',
            JfSpKvup: 'fA6**********HSk',
            yPT7xnUp: 'qjr**********pw6',
            wfT6rFaz: {
                Ja9nYEdM: 'VPK**********zb6',
                JfSpKvup: 'fA6**********HSk',
                yPT7xnUp: 'qjr**********pw6',
            },
            xDAjTeek: {
                Ja9nYEdM: ['VPK**********zb6'],
                JfSpKvup: new Set(['fA6**********HSk']),
                yPT7xnUp: new Map([[0, 'qjr**********pw6']]),
                wfT6rFaz: {
                    Ja9nYEdM: 'VPK**********zb6',
                    JfSpKvup: 'fA6**********HSk',
                    yPT7xnUp: 'qjr**********pw6',
                },
            },
        });
    });
    test('.ipGeoData()', async () => {
        expect($redact.ipGeoData(await $user.ipGeoData())).toStrictEqual({
            city: 'Mad***ska',
            colo: 'EWR',
            continent: 'NA',
            country: 'US',
            ip: '127*******.42',
            latitude: '4******0',
            longitude: '-68***160',
            metroCode: '552',
            postalCode: '0***6',
            region: 'Maine',
            regionCode: 'ME',
            timezone: 'America/New_York',
        });
    });
    test('.headers()', async () => {
        expect([
            ...$redact
                .headers(
                    $http.parseHeaders({
                        'cf-connecting-ip': '127.88.201.42',
                        'foo': 'bar',
                        'forwarded': 'for=127.88.201.42',
                        'location': 'https://x.tld/?foo=hello+world&utm_source=test',
                        'referer': 'https://x.tld/?foo=hello+world&utm_source=test',
                        'x-forwarded-for': '127.88.201.42',
                        'x-waf-key': '7MbXxN9krvfrU4Cp',
                    }),
                )
                .entries(),
        ]).toStrictEqual([
            ['cf-connecting-ip', '127*******.42'],
            ['foo', 'b*r'],
            ['forwarded', 'for***********.42'],
            ['location', 'https://x.tld/?foo=hel*****rld&utm_source=test'],
            ['referer', 'https://x.tld/?foo=hel*****rld&utm_source=test'],
            ['x-forwarded-for', '127*******.42'],
            ['x-waf-key', '7Mb**********4Cp'],
        ]);
        expect([
            ...$redact
                .headers(
                    $http.parseHeaders({
                        'cf-connecting-ip': '127.88.201.42',
                        'foo': 'bar',
                        'forwarded': 'for=127.88.201.42',
                        'location': 'An invalid URL should go unredacted; e.g., for closer review.',
                        'referer': 'An invalid URL should go unredacted; e.g., for closer review.',
                        'x-forwarded-for': '127.88.201.42',
                        'x-waf-key': '7MbXxN9krvfrU4Cp',
                    }),
                )
                .entries(),
        ]).toStrictEqual([
            ['cf-connecting-ip', '127*******.42'],
            ['foo', 'b*r'],
            ['forwarded', 'for***********.42'],
            ['location', 'An invalid URL should go unredacted; e.g., for closer review.'],
            ['referer', 'An invalid URL should go unredacted; e.g., for closer review.'],
            ['x-forwarded-for', '127*******.42'],
            ['x-waf-key', '7Mb**********4Cp'],
        ]);
    });
});
