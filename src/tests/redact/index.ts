/**
 * Test suite.
 */

import { $redact, $user } from '#index.ts';
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
    test('.ipGeoData()', async () => {
        expect($redact.ipGeoData(await $user.ipGeoData())).toStrictEqual({
            city: 'Mad***ska',
            colo: 'EWR',
            continent: 'NA',
            country: 'US',
            ip: '184*********157',
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
        expect(
            $redact.headers({
                'foo': 'bar',
                'x-waf-key': '7MbXxN9krvfrU4Cp',
                'forwarded': 'for=184.153.133.157',
                'x-forwarded-for': '184.153.133.157',
                'cf-connecting-ip': '184.153.133.157',
                'referer': 'https://x.tld/?foo=hello+world&utm_source=test',
                'location': 'https://x.tld/?foo=hello+world&utm_source=test',
            }),
        ).toStrictEqual({
            'foo': 'bar',
            'x-waf-key': '7Mb**********4Cp',
            'forwarded': 'for*************157',
            'x-forwarded-for': '184*********157',
            'cf-connecting-ip': '184*********157',
            'referer': 'https://x.tld/?foo=hel*****rld&utm_source=test',
            'location': 'https://x.tld/?foo=hel*****rld&utm_source=test',
        });
        expect(
            $redact.headers({
                'foo': 'bar',
                'x-waf-key': '7MbXxN9krvfrU4Cp',
                'forwarded': 'for=184.153.133.157',
                'x-forwarded-for': '184.153.133.157',
                'cf-connecting-ip': '184.153.133.157',
                'referer': 'An invalid URL should go unredacted; e.g., for closer review.',
                'location': 'An invalid URL should go unredacted; e.g., for closer review.',
            }),
        ).toStrictEqual({
            'foo': 'bar',
            'x-waf-key': '7Mb**********4Cp',
            'forwarded': 'for*************157',
            'x-forwarded-for': '184*********157',
            'cf-connecting-ip': '184*********157',
            'referer': 'An invalid URL should go unredacted; e.g., for closer review.',
            'location': 'An invalid URL should go unredacted; e.g., for closer review.',
        });
    });
});
