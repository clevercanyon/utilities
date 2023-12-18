/**
 * App utilities.
 */

import '#@initialize.ts';

import { $appꓺ$pkgName, $fnꓺmemo } from '#@standalone/index.ts';
import { $brand, $env, $obj, $str, $time, $url, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type BaseURLOptions = {
    parsed?: boolean;
};

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
    return $env.get('APP_PKG_NAME', { type: 'string', require: true });
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
 * Gets current app’s package version.
 *
 * @returns Current app’s package version.
 *
 * @throws  If `APP_PKG_VERSION` is missing.
 */
export const pkgVersion = $fnꓺmemo((): string => {
    return $env.get('APP_PKG_VERSION', { type: 'string', require: true });
});

/**
 * Gets current app’s build time.
 *
 * @returns Current app’s build time; {@see $type.Time}.
 *
 * @throws  If `APP_BUILD_TIME_STAMP` is missing.
 */
export const buildTime = $fnꓺmemo((): $type.Time => {
    return $time.parse($env.get('APP_BUILD_TIME_STAMP', { type: 'string', require: true }));
});

/**
 * Checks if environment has an app’s base URL.
 *
 * @returns True if environment has an app’s base URL.
 */
export const hasBaseURL = $fnꓺmemo((): boolean => {
    return $env.get('APP_BASE_URL') ? true : false;
});

/**
 * Gets current app’s base URL.
 *
 * @param   options Options (all optional); {@see BaseURLOptions}.
 *
 * @returns         Current app’s base URL.
 *
 * @throws          If `APP_BASE_URL` is missing.
 */
export const baseURL = $fnꓺmemo(
    { deep: true, maxSize: 2 },
    <Options extends BaseURLOptions>(options?: Options): Options extends BaseURLOptions & { parsed: true } ? $type.URL : string => {
        const opts = $obj.defaults({}, options || {}, { parsed: false }) as Required<BaseURLOptions>,
            value = $env.get('APP_BASE_URL', { type: 'string', require: true });
        return (opts.parsed ? $url.parse(value) : value) as ReturnType<typeof baseURL<Options>>;
    },
);

/**
 * Gets current app’s brand props.
 *
 * @returns Current app’s brand props.
 *
 * @throws  If `APP_BRAND_PROPS` is missing.
 */
export const brandProps = $fnꓺmemo((): Partial<$type.BrandRawProps> => {
    return $env.get('APP_BRAND_PROPS', { require: true }) as Partial<$type.BrandRawProps>;
});

/**
 * Gets current app’s brand.
 *
 * @returns Current app’s brand.
 *
 * @throws  If `APP_BRAND` is missing.
 */
export const brand = $fnꓺmemo((): $type.Brand => {
    const value = $env.get('APP_BRAND');
    if (!value) $env.set('APP_BRAND', $brand.addApp());
    return $env.get('APP_BRAND', { require: true }) as $type.Brand;
});
