/**
 * App utilities.
 */

import '#@initialize.ts';

import { $appꓺ$pkgName, $fnꓺmemo, $fnꓺonce } from '#@standalone/index.ts';
import { $brand, $env, $str, $url, type $type } from '#index.ts';

/**
 * Tracks brand adaptation internally.
 */
let brandAdapted: boolean; // Initialize.

/**
 * Utilities package name.
 */
export const $pkgName = $appꓺ$pkgName;

/**
 * Gets current app’s package name.
 *
 * @returns Current app’s package name.
 *
 * @throws  If `APP_PKG_NAME` is missing.
 */
export const pkgName = $fnꓺmemo((): string => {
    let value: string; // Initialize.

    if (!(value = $env.get('APP_PKG_NAME', { type: 'string' }))) {
        throw Error('Bfr8cnc9'); // Missing `APP_PKG_NAME`.
    }
    return value;
});

/**
 * Gets current or specific app’s package slug.
 *
 * @param   value Optional. Default is {@see pkgName()}.
 *
 * @returns       Slug derived from an app’s package name.
 *
 * @throws        If no `value` and `APP_PKG_NAME` is missing.
 *
 * @note e.g., `@org/[slug]` if scoped. Otherwise, a simple `slug`.
 */
export const pkgSlug = $fnꓺmemo(12, (value?: string): string => {
    value ??= pkgName(); // Uses current app’s package name as the default value.
    value = value.replace(/^@/u, '').split('/')[1] || value; // Scoped package names.

    return $str.kebabCase(value, { asciiOnly: true, letterFirst: 'x' });
});

/**
 * Gets current app’s base URL.
 *
 * @returns Current app’s base URL.
 *
 * @throws  If `brandAdapted` is not `true` yet.
 * @throws  If `APP_BASE_URL` is missing.
 */
export const baseURL = $fnꓺmemo((): string => {
    if (!brandAdapted) {
        throw Error('95kgxMsG'); // Called out of sequence.
    }
    let value: string; // Initialize.

    if (!(value = $env.get('APP_BASE_URL', { type: 'string' }))) {
        throw Error('Tmvgc7Bv'); // Missing `APP_BASE_URL`.
    }
    return value;
});

/**
 * Adapts current app’s brand to a given host.
 *
 * If this function is called numerous times, note that it onlys runs once.
 *
 * This utility should only be called once, and only after an app’s initializer has run, and only before an app defines
 * its `APP_BRAND` environment variable, which this method handles. The expectation is that this utility will only be
 * called once after `APP_PKG_NAME`, `APP_BASE_URL`, and `APP_BRAND_PROPS` environment variables have been set. This
 * utility’s goal is to adapt `APP_BASE_URL` using the given `host`, and then to define `APP_BRAND` for the first time;
 * i.e., using the adapted base URL. There must not be any calls to {@see baseURL()} until this adaptation occurs.
 *
 * The required sequence is as follows:
 *
 *     $env.set('APP_PKG_NAME', '@clevercanyon/x.tld');
 *     $env.set('APP_BASE_URL', 'https://x.tld/base/');
 *     $env.set('APP_BRAND_PROPS', {});
 *     $app.adaptBrand.fresh('x.tld');
 *
 * @param  host Host w/port, to adapt to.
 *
 * @throws      If `brandAdapted` is `true` already.
 * @throws      If `APP_PKG_NAME` does not exist already.
 * @throws      If `APP_BASE_URL` does not exist already.
 * @throws      If `APP_BRAND_PROPS` does not exist already.
 * @throws      If `APP_BRAND` does exist already.
 */
export const adaptBrand = $fnꓺonce((host: string): void => {
    if (
        brandAdapted || //
        $env.get('APP_BRAND') ||
        !$env.get('APP_PKG_NAME') ||
        !$env.get('APP_BASE_URL') ||
        !$env.get('APP_BRAND_PROPS')
    ) {
        throw Error('vwRtGSnR'); // Called out of sequence.
    }
    brandAdapted = true; // Adapting brand now.

    const adaptedBaseURL = $url.parse(baseURL());
    adaptedBaseURL.host = host || adaptedBaseURL.host;
    baseURL.flush(); // Flushes the base URL cache now.

    $env.set('APP_BASE_URL', adaptedBaseURL.toString());
    $env.set('APP_BRAND', $brand.addApp());
});

/**
 * Gets current app’s raw brand props.
 *
 * @returns Current app’s raw brand props.
 *
 * @throws  If `APP_BRAND_PROPS` is missing.
 *
 * @note `APP_BRAND` typically depends on these.
 */
export const brandProps = $fnꓺmemo((): $type.BrandRawProps => {
    let value: $type.BrandRawProps; // Initialize.

    if (!(value = $env.get('APP_BRAND_PROPS') as $type.BrandRawProps)) {
        throw Error('aFS2xh2X'); // Missing `APP_BRAND_PROPS`.
    }
    return value;
});

/**
 * Gets current app’s brand.
 *
 * @returns Current app’s brand.
 *
 * @throws  If `APP_BRAND` is missing.
 */
export const brand = $fnꓺmemo((): $type.Brand => {
    let value: $type.Brand; // Initialize.

    if (!(value = $env.get('APP_BRAND') as $type.Brand)) {
        throw Error('d6W8bWAG'); // Missing `APP_BRAND`.
    }
    return value;
});
