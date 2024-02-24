/**
 * Test suite.
 */

import { $user } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$user', async () => {
    test('.updateConsentData()', async () => {
        const consentData1 = $user.consentData();
        expect(consentData1.prefs.optIn.acceptAnalyticsCookies).toBe(null);

        $user.updateConsentData({ prefs: { optIn: { acceptAnalyticsCookies: true } } });
        expect(consentData1.prefs.optIn.acceptAnalyticsCookies).toBe(null);

        const consentData2 = $user.consentData();
        expect(consentData2.prefs.optIn.acceptAnalyticsCookies).toBe(true);

        // Restores original consent data.
        $user.updateConsentData({ prefs: { optIn: { acceptAnalyticsCookies: null } } });
    });
    test('.consentData()', async () => {
        const consentData1 = $user.consentData();
        expect(consentData1.prefs.optIn.acceptAnalyticsCookies).toBe(null);

        // Object is frozen deeply, so this should throw an error.
        // @ts-ignore -- Ignoring readonly warning, as it is a part of the test.
        expect((): void => void (consentData1.prefs.optIn.acceptAnalyticsCookies = true)).toThrow();

        const consentData2 = $user.consentData();
        expect(consentData2.prefs.optIn.acceptAnalyticsCookies).toBe(null);
    });
    test('.consentState()', async () => {
        const consentState1 = await $user.consentState();
        expect(consentState1.canUse.analytics).toBe(true);

        // Object is frozen deeply, so this should throw an error.
        // @ts-ignore -- Ignoring readonly warning, as it is a part of the test.
        expect((): void => void (consentState1.canUse.analytics = false)).toThrow();

        const consentState2 = await $user.consentState();
        expect(consentState2.canUse.analytics).toBe(true);
    });
    test('.ipGeoData()', async () => {
        await $user.ipGeoData();
        await $user.ipGeoData(undefined);
        expect(await $user.ipGeoData()).toStrictEqual({
            'city': 'Madawaska',
            'colo': 'EWR',
            'continent': 'NA',
            'country': 'US',
            'ip': '127.88.201.42',
            'latitude': '47.33320',
            'longitude': '-68.33160',
            'metroCode': '552',
            'postalCode': '04756',
            'region': 'Maine',
            'regionCode': 'ME',
            'timezone': 'America/New_York',
        });
        expect($user.ipGeoData.cache.keys.length).toBe(1);
    });
    test('.ip()', async () => {
        expect(await $user.ip()).toBe('127.88.201.42');
    });
});
