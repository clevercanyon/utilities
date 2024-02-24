/**
 * User utilities.
 */

import '#@initialize.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $app, $cookie, $crypto, $env, $fn, $http, $json, $obj, $obp, $str, $to, $type } from '#index.ts';

/**
 * Defines types.
 *
 *     ip: '127.88.201.42',
 *
 *     city: 'Madawaska',
 *     region: 'Maine',
 *     regionCode: 'ME',
 *     postalCode: '04756',
 *     continent: 'NA',
 *     country: 'US',
 *
 *     colo: 'EWR',
 *     metroCode: '552',
 *     latitude: '47.33320',
 *     longitude: '-68.33160',
 *     timezone: 'America/New_York'
 */
export type IPGeoData = $type.ReadonlyDeep<{
    ip: string;

    city: string;
    region: string;
    regionCode: string;
    postalCode: string;
    continent: string;
    country: string;

    colo: string;
    metroCode: string;
    latitude: string;
    longitude: string;
    timezone: string;
}>;
type IPGeoDataResponsePayload = $type.ReadonlyDeep<{
    ok: boolean;
    error?: { message: string };
    data?: IPGeoData;
}>;
export type ConsentData = {
    prefs: {
        optIn: {
            acceptFunctionalityCookies: boolean | null;
            acceptAnalyticsCookies: boolean | null;
            acceptAdvertisingCookies: boolean | null;
        };
        optOut: {
            doNotSellOrSharePII: boolean | null;
        };
    };
    id: string;
    version: string;
    lastUpdated: number;
    lastUpdatedFrom: {
        country: string;
        regionCode: string;
    };
};
export type ConsentState = {
    ipGeoData: IPGeoData;

    hasOptOutFlag: boolean;
    hasUpdatedPrefs: boolean;
    hasGeoStalePrefs: boolean;

    canUse: {
        essential: boolean;
        thirdParty: boolean;
        functionality: boolean;
        analytics: boolean;
        advertising: boolean;
    };
};

/**
 * Checks if user-agent is a major crawler.
 *
 * @param   request Optional HTTP request to check.
 *
 *   - If not passed, only a web environment can provide.
 *
 * @returns         True if user-agent is a major crawler.
 */
export const isMajorCrawler = $fnꓺmemo(2, (request?: $type.Request) => {
    const regExps = [
        /\b(?:google|bing|msn|adidx|duckduck)bot\b/iu, // `*bot` patterns.
        /\b(?:(?:ads|store)bot|apis|mediapartners)-google\b/iu, // `*-google` patterns.
        /\bgoogle(?:-(?:read|site|adwords|extended|inspectiontool|structured)|producer|other)\b/iu, // `google{-*,*}` patterns.
        /\b(?:slurp|teoma|yeti|heritrix|ia_archiver|archive\.org_bot|baiduspider|yandex\.com\/bots)\b/iu, // Other search engines.
    ];
    if (request) {
        const { headers } = request;
        const userAgent = headers.get('user-agent') || '';
        if (regExps.some((regExp) => regExp.test(userAgent))) return true;
    }
    return $env.isWeb() && regExps.some((regExp) => regExp.test(navigator.userAgent));
});

/**
 * Checks GPC/DNT headers.
 *
 * @param   request Optional HTTP request to check.
 *
 *   - If not passed, only a web environment can provide.
 *
 * @returns         True when GPC and/or DNT header is `=== '1'`.
 */
export const hasGlobalPrivacy = $fnꓺmemo(2, (request?: $type.Request): boolean => {
    if (request) {
        const { headers } = request;
        if ('1' === headers.get('sec-gpc') || '1' === headers.get('dnt')) return true;
    }
    return $env.isWeb() && ('1' === navigator.globalPrivacyControl || '1' === navigator.doNotTrack);
});

/**
 * Gets user-agent; e.g., `Mozilla/5.0 ...`.
 *
 * @param   request Optional HTTP request.
 *
 *   - If not passed, only a web environment can provide.
 *
 * @returns         User-agent string; e.g., `Mozilla/5.0 ...`.
 */
export const agent = $fnꓺmemo(2, (request?: $type.Request): string => {
    if (request) {
        return request.headers.get('user-agent') || '';
    }
    return $env.isWeb() ? navigator.userAgent : '';
});

/**
 * Gets languages; e.g., `fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5`.
 *
 * @param   request Optional HTTP request.
 *
 *   - If not passed, only a web environment can provide.
 *
 * @returns         Languages; e.g., `fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5`.
 */
export const languages = $fnꓺmemo(2, (request?: $type.Request): string => {
    if (request) {
        return request.headers.get('accept-language') || '';
    }
    return $env.isWeb() ? navigator.languages.join(',') : '';
});

/**
 * Gets external IP address.
 *
 * By default, we prioritize the IP headers that Cloudflare sets, because those are the ones they’ve used for IP
 * geolocation data and Turnstile verifications. Note that Cloudflare does not allow IP address headers like
 * `forwarded`, `x-forwarded-for` to modify geolocation data or Turnstile. They always use the actual connecting IP
 * address, even in the presence of a `forwarded`, `x-forwarded-for`, `x-real-ip`, or other IP address header.
 *
 * Other Notes:
 *
 * - The `x-real-ip` request header is automatically rewritten by Cloudflare to match `cf-connecting-ip`.
 * - The `x-forwarded-for` header may be appended to, but is otherwise preserved by Cloudflare. Therefore, it is
 *   theoretically possible to implement our own IP geolocation lookups if we really need to. A custom lookup could then
 *   choose to prioritize `forwarded`, `x-forwarded-for` when performing lookups. However, any location-oriented WAF
 *   rules on the Cloudflare side would then be out of sync with our custom handling of IP address headers.
 * - Regarding `forwarded`, which contains `for=IPv4|"[IPv6]"`; {@see https://o5p.me/Hfdn1u}.
 *
 * @param   request                    Optional HTTP request.
 *
 *   - If not passed, only a remote connection can provide a user’s external IP.
 *   - //
 * @param   prioritizeForwardedHeaders Default is `false` for reasons stated above. Passing `prioritizeForwardedHeaders`
 *   as `true` changes the default prioritization used by this utility. It is useful under certain conditions.
 *
 * @returns                            Promise of IP address.
 *
 * @throws                             We don’t want Cloudflare workers making remote connections for IP geolocation
 *   data, because: (a) they already have this data in `request`; and (b) without a `request`, the IP geolocation data
 *   would be memoized globally at runtime by a worker that is actually serving multiple requests. Any attempt to obtain
 *   IP geolocation data from a Cloudflare worker, without passing in a specific `request`, results in an exception
 *   being thrown by {@see ipGeoData()}.
 */
export const ip = $fnꓺmemo(2, async (request?: $type.Request, prioritizeForwardedHeaders?: boolean): Promise<string> => {
    if (request) {
        const forwardedHeaders = [
            'forwarded', // May contain multiple for=IP directives.
            'x-forwarded-for', // May contain multiple IPs.
        ];
        for (const headerName of [
            ...(prioritizeForwardedHeaders ? forwardedHeaders : []),
            ...$http.ipHeaderNames(), // IP header names, in order of precedence.
            ...(!prioritizeForwardedHeaders ? forwardedHeaders : []),
        ]) {
            let ip = request.headers.get(headerName) || '';

            if (ip && 'forwarded' === headerName) {
                // {@see https://regex101.com/r/QNCDee/1}.
                ip = ip.match(/\bfor=['"]?\[?([^'"[\]\s;,]+)/iu)?.[1] || '';
            }
            if (ip) {
                ip =
                    ip
                        .split(/[\s;,]+/u)
                        .map((ip) => $str.trim(ip))
                        .find((ip) => $str.isIP(ip))
                        ?.toLowerCase() || '';
            }
            if (ip) return ip;
        }
        return ''; // Unavailable.
    }
    return (await ipGeoData()).ip; // Remote connection.
});

/**
 * Gets IP geolocation data.
 *
 * @param   request Optional HTTP request.
 *
 *   - If not passed, only a remote connection can provide.
 *
 * @returns         Promise of IP geolocation data, frozen deeply.
 *
 * @throws          We don’t want Cloudflare workers making remote connections for geolocation, because: (a) they
 *   already have this data in `request`; and (b) without a `request`, the IP geolocation data would be memoized
 *   globally at runtime by a worker that is actually serving multiple requests. Any attempt to obtain IP geolocation
 *   data from a Cloudflare worker, without passing in a specific `request`, results in an exception being thrown.
 *
 * @see https://o5p.me/rwa3h7
 */
export const ipGeoData = $fnꓺmemo(
    // Ensures no args is the same as passing `request: undefined`.
    { maxSize: 2, transformKey: (args: unknown[]): unknown[] => (args.length ? args : [undefined]) },
    //
    async (request?: $type.Request): Promise<IPGeoData> => {
        // We don’t want tests making remote connections.
        const isTest = $env.isTest(); // Cached for reuse below.

        if (request || isTest) {
            const cf = (request as undefined | $type.cfw.Request)?.cf,
                data = {
                    ip: isTest ? '127.88.201.42' // Random private IP.
                  : request ? await ip(request) : '', // prettier-ignore

                    city: isTest ? 'Madawaska' : cf?.city,
                    region: isTest ? 'Maine' : cf?.region,
                    regionCode: isTest ? 'ME' : cf?.regionCode,
                    postalCode: isTest ? '04756' : cf?.postalCode,
                    continent: isTest ? 'NA' : cf?.continent,
                    country: isTest ? 'US' : cf?.country,

                    colo: isTest ? 'EWR' : cf?.colo,
                    metroCode: isTest ? '552' : cf?.metroCode,
                    latitude: isTest ? '47.33320' : cf?.latitude,
                    longitude: isTest ? '-68.33160' : cf?.longitude,
                    timezone: isTest ? 'America/New_York' : cf?.timezone,
                };
            // Enforces data being readonly.
            return $obj.deepFreeze($obj.map(data, (v) => $to.string(v))) as IPGeoData;
            //
        } else if ($env.isCFW()) throw Error('NQva8dRK'); // See notes above.

        return fetch('https://workers.hop.gdn/utilities/api/ip-geo/v1') //
            .then(async (response): Promise<IPGeoDataResponsePayload> => {
                return $to.plainObject(await response.json()) as IPGeoDataResponsePayload;
            })
            .then(({ ok, data }): IPGeoData => {
                if (!ok) throw Error('DkvKa3NM');

                // Enforces data being readonly.
                return $obj.deepFreeze(data) as IPGeoData;
            });
    },
);

/**
 * Gets user’s UTX user ID.
 *
 * We use this for analytics, which only allows 36 chars.
 *
 * @param   request Optional HTTP request.
 *
 *   - If not passed, only a web environment or an app’s etc config can provide.
 *
 * @returns         User’s UTX user ID (36 chars max); else an empty string.
 */
export const utxId = (request?: $type.Request): string => {
    if (request || $env.isWeb()) {
        return $cookie.get('utx_user_id', { request });
    } else {
        return $app.etcConfig().user?.utxId || '';
    }
};

/**
 * Gets user’s UTX author ID.
 *
 * We use this for analytics, which only allows 36 chars.
 *
 * @param   request Optional HTTP request.
 *
 *   - If not passed, only a web environment or an app’s etc config can provide.
 *
 * @returns         User’s UTX author ID (36 chars max); else an empty string.
 */
export const utxAuthorId = (request?: $type.Request): string => {
    if (request || $env.isWeb()) {
        return $cookie.get('utx_author_id', { request });
    } else {
        return $app.etcConfig().user?.utxAuthorId || '';
    }
};

/**
 * Gets user’s UTX customer ID.
 *
 * We use this for analytics, which only allows 36 chars.
 *
 * @param   request Optional HTTP request.
 *
 *   - If not passed, only a web environment or an app’s etc config can provide.
 *
 * @returns         User’s UTX customer ID (36 chars max); else an empty string.
 */
export const utxCustomerId = (request?: $type.Request): string => {
    if (request || $env.isWeb()) {
        return $cookie.get('utx_customer_id', { request });
    } else {
        return $app.etcConfig().user?.utxCustomerId || '';
    }
};

/**
 * Updates consent data.
 *
 * @param  updates  Updates to merge in; {@see ConsentData}.
 * @param  callback Optional callback; e.g., for persistent storage.
 *
 * @throws          We don’t want Cloudflare workers using an app’s etc configuration for consent data. There is no
 *   justifiable reason for doing so. Any attempt to update consent data from a Cloudflare worker, without passing in a
 *   specific `request`, results in an exception being thrown by {@see consentData()}.
 */
export const updateConsentData = (
    updates: $type.PartialDeep<ConsentData>, //
    callback?: (consentData: $type.ReadonlyDeep<ConsentData>) => void | Promise<void>,
): void => {
    const newConsentData = // Merges and deep freezes new consent data.
        $obj.deepFreeze($obj.mergeClonesDeep(consentData(), updates)) as unknown as $type.ReadonlyDeep<ConsentData>;

    if ($env.isWeb()) {
        $cookie.set('consent', $json.stringify(newConsentData));
        //
    } else $app.updateEtcConfig({ user: { consent: newConsentData } });

    consentData.flush(), consentState.flush();
    if (callback) void callback(newConsentData);
};

/**
 * Gets consent data.
 *
 * Consent data is partially derived from; {@see hasGlobalPrivacy()}.
 *
 * @param   request Optional HTTP request.
 *
 *   - If not passed, only a web environment or an app’s etc config can provide.
 *
 * @returns         Consent data, frozen deeply.
 *
 * @throws          We don’t want Cloudflare workers using an app’s etc configuration for consent data. There is no
 *   justifiable reason for doing so. Any attempt to obtain consent data from a Cloudflare worker, without passing in a
 *   specific `request`, results in an exception being thrown.
 *
 * @note Cache is flushed by {@see updateConsentData()}.
 *
 * @diagram https://o5p.me/ZQ49Ij
 */
export const consentData = $fnꓺmemo(2, (request?: $type.Request): $type.ReadonlyDeep<ConsentData> => {
    let data; // Initialize.

    if (request) {
        const json = $cookie.get('consent', { request }) || '{}';
        data = $fn.try(() => $json.parse(json), {})();
        //
    } else if ($env.isCFW()) throw Error('WKQr5uZs'); // See notes above.
    //
    else if ($env.isWeb()) {
        const json = $cookie.get('consent') || '{}';
        data = $fn.try(() => $json.parse(json), {})();
        //
    } else {
        // e.g., A CLI tool, or another app type.
        data = $app.etcConfig().user?.consent || {};
    }
    const hasGP = hasGlobalPrivacy(request),
        typecastPrefs = <Type extends object>(prefs: Type): Type => {
            for (const [key, value] of Object.entries(prefs)) {
                (prefs as $type.Object)[key] = null === value ? value : Boolean(value);
            }
            return prefs;
        };
    return $obj.deepFreeze({
        prefs: {
            optIn: typecastPrefs({
                acceptFunctionalityCookies: $obp.get(data, 'prefs.optIn.acceptFunctionalityCookies', hasGP ? false : null),
                acceptAnalyticsCookies: $obp.get(data, 'prefs.optIn.acceptAnalyticsCookies', hasGP ? false : null),
                acceptAdvertisingCookies: $obp.get(data, 'prefs.optIn.acceptAdvertisingCookies', hasGP ? false : null),
            } as ConsentData['prefs']['optIn']),

            optOut: typecastPrefs({
                doNotSellOrSharePII: $obp.get(data, 'prefs.optOut.doNotSellOrSharePII', hasGP ? true : null),
            } as ConsentData['prefs']['optOut']),
        },
        // This is a user’s own consent-specific identifier.
        // An ID is auto-generated if one does not exist already.
        id: String($obp.get(data, 'id') || $crypto.uuidV4()),

        version: String($obp.get(data, 'version', '')),
        lastUpdated: Number($obp.get(data, 'lastUpdated', 0)) || 0,
        lastUpdatedFrom: {
            country: String($obp.get(data, 'lastUpdatedFrom.country', '')),
            regionCode: String($obp.get(data, 'lastUpdatedFrom.regionCode', '')),
        },
    });
});

/**
 * Gets consent state.
 *
 * Consent state is derived from; {@see consentData()}, {@see hasGlobalPrivacy()}.
 *
 * @param   request Optional HTTP request.
 *
 *   - If not passed, only a web environment or an app’s config can provide.
 *
 * @returns         Promise of consent state, frozen deeply.
 *
 * @throws          We don’t want Cloudflare workers using an app’s etc configuration for consent state. There is no
 *   justifiable reason for doing so. Any attempt to obtain consent state from a Cloudflare worker, without passing in a
 *   specific `request`, results in an exception being thrown by {@see consentData()}.
 *
 * @note Cache is flushed by {@see updateConsentData()}.
 *
 * @diagram https://o5p.me/ZQ49Ij
 */
export const consentState = $fnꓺmemo(2, async (request?: $type.Request): Promise<$type.ReadonlyDeep<ConsentState>> => {
    const data = consentData(request),
        hasGP = hasGlobalPrivacy(request),
        state = { ipGeoData: await ipGeoData(request) } as unknown as ConsentState;

    state.hasUpdatedPrefs = data.lastUpdated ? true : false;
    state.hasOptOutFlag = hasGP || data.prefs.optOut.doNotSellOrSharePII ? true : false;
    state.hasGeoStalePrefs = state.hasUpdatedPrefs && // e.g., Whenever a user has changed locations since last setting prefs.
        (data.lastUpdatedFrom.country !== state.ipGeoData.country || data.lastUpdatedFrom.regionCode !== state.ipGeoData.regionCode); // prettier-ignore

    if (!state.hasOptOutFlag && 'US' === state.ipGeoData.country) {
        state.canUse = {
            essential: true, // Always on.
            thirdParty: state.hasGeoStalePrefs ? false : true,
            functionality: state.hasGeoStalePrefs || false === data.prefs.optIn.acceptFunctionalityCookies ? false : true,
            analytics: state.hasGeoStalePrefs || false === data.prefs.optIn.acceptAnalyticsCookies ? false : true,
            advertising: state.hasGeoStalePrefs || false === data.prefs.optIn.acceptAdvertisingCookies ? false : true,
        };
    } else {
        state.canUse = {
            essential: true, // Always on.
            thirdParty: !state.hasOptOutFlag && !state.hasGeoStalePrefs ? true : false,
            functionality: !state.hasOptOutFlag && !state.hasGeoStalePrefs && true === data.prefs.optIn.acceptFunctionalityCookies ? true : false,
            analytics: !state.hasOptOutFlag && !state.hasGeoStalePrefs && true === data.prefs.optIn.acceptAnalyticsCookies ? true : false,
            advertising: !state.hasOptOutFlag && !state.hasGeoStalePrefs && true === data.prefs.optIn.acceptAdvertisingCookies ? true : false,
        };
    }
    return $obj.deepFreeze(state);
});
