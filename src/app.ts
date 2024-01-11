/**
 * App utilities.
 */

import '#@initialize.ts';

import { $appꓺ$pkgName, $fnꓺmemo } from '#@standalone/index.ts';
import { $brand, $env, $obj, $str, $time, $url, $user, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type BaseURLOptions = { parsed?: boolean };
export type Config<Type extends object = object> = $type.Object<Type>;
export type EtcConfig<Type extends object = object> = $type.Object<Type> & {
    user?: {
        id?: string;
        utxId?: string;

        customerId?: string;
        utxCustomerId?: string;

        consent?: $user.ConsentData;
    };
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
 *
 * @note Unable to deep freeze a URL, but we would do so if possible.
 *       For now, we just declare it readonly using a TypeScript return type.
 */
export const baseURL = $fnꓺmemo(
    { deep: true, maxSize: 2 },
    <Options extends BaseURLOptions>(options?: Options): Options extends BaseURLOptions & { parsed: true } ? $type.ReadonlyDeep<$type.URL> : string => {
        const opts = $obj.defaults({}, options || {}, { parsed: false }) as Required<BaseURLOptions>,
            value = $env.get('APP_BASE_URL', { type: 'string', require: true });
        return (opts.parsed ? $url.parse(value) : value) as ReturnType<typeof baseURL<Options>>;
    },
);

/**
 * Checks if environment has an app’s brand props.
 *
 * @returns True if environment has an app’s brand props.
 */
export const hasBrandProps = $fnꓺmemo((): boolean => {
    return $env.get('APP_BRAND_PROPS') ? true : false;
});

/**
 * Gets current app’s brand props.
 *
 * @returns Current app’s brand props, frozen deeply.
 *
 * @throws  If `APP_BRAND_PROPS` is missing.
 */
export const brandProps = $fnꓺmemo((): Partial<$type.BrandRawProps> => {
    return $obj.deepFreeze($env.get('APP_BRAND_PROPS', { require: true })) as Partial<$type.BrandRawProps>;
});

/**
 * Gets current app’s brand.
 *
 * @returns Current app’s brand.
 *
 * @throws  If `APP_BRAND` is missing.
 *
 * @note A brand is already frozen deeply.
 */
export const brand = $fnꓺmemo((): $type.Brand => {
    const value = $env.get('APP_BRAND');
    if (!value) $env.set('APP_BRAND', $brand.addApp());
    return $env.get('APP_BRAND', { require: true }) as $type.Brand;
});

/**
 * Gets current app’s configuration.
 *
 * Apps using a configuration must populate `APP_CONFIG` when initializing. Otherwise, this will simply return an empty
 * object instead of meaningful data. An app’s configuration is typically initialized by reading an app’s designated
 * configuration file; e.g., `./madrun.config.mjs`), which handles persistent storage. When updating an app’s
 * configuration {@see updateConfig()}, the same configuration file might then be written to.
 *
 * - An app’s normal configuration is typically maintained by the app’s user; i.e., configured by user.
 * - An app’s etc configuration is typically maintained by the app; e.g., storage of a user’s consent preferences.
 *
 * @returns Current app’s configuration data, frozen deeply.
 *
 * @note Cache is flushed by {@see updateConfig()}.
 */
export const config = $fnꓺmemo(<Type extends object = $type.Object>(): Config<Type> => {
    return $obj.deepFreeze($env.get('APP_CONFIG', { type: 'object', default: {} })) as Config<Type>;
});

/**
 * Gets current app’s etc configuration.
 *
 * Apps using an etc configuration must populate `APP_ETC_CONFIG` when initializing. Otherwise, this will simply return
 * an empty object instead of meaningful data. An app’s etc configuration is typically initialized by reading an app’s
 * designated configuration file; e.g., `~/.config/madrun.json`), which handles persistent storage. When updating an
 * app’s etc configuration {@see updateEtcConfig()}, the same configuration file should then be written to.
 *
 * - An app’s etc configuration is typically maintained by the app; e.g., storage of a user’s consent preferences.
 * - An app’s normal configuration is typically maintained by the app’s user; i.e., configured by user.
 *
 * @returns Current app’s etc configuration data, frozen deeply.
 *
 * @note Cache is flushed by {@see updateEtcConfig()}.
 */
export const etcConfig = $fnꓺmemo(<Type extends object = $type.Object>(): EtcConfig<Type> => {
    return $obj.deepFreeze($env.get('APP_ETC_CONFIG', { type: 'object', default: {} })) as EtcConfig<Type>;
});

/**
 * Updates current app’s configuration.
 *
 * @param updates  Updates to merge in; {@see Config}.
 * @param callback Optional callback; e.g., for persistent storage.
 *
 * @note An app’s configuration data is added to audit logs.
 *       Therefore, please do NOT store sensitive information.
 */
export const updateConfig = <Type extends object = $type.Object>(
    updates: $type.PartialDeep<Config<Type>>, //
    callback?: (config: $type.ReadonlyDeep<Config<Type>>) => void | Promise<void>,
): void => {
    const newConfig = // Merges and deep freezes new configuration data.
        $obj.deepFreeze($obj.mergeClonesDeep(config(), updates)) as unknown as $type.ReadonlyDeep<Config<Type>>;

    $env.set('APP_CONFIG', newConfig), config.flush();
    if (callback) void callback(newConfig);
};

/**
 * Updates current app’s etc configuration.
 *
 * @param updates  Updates to merge in; {@see EtcConfig}.
 * @param callback Optional callback; e.g., for persistent storage.
 *
 * @note An app’s etc configuration data is added to audit logs.
 *       Therefore, please do NOT store sensitive information.
 */
export const updateEtcConfig = <Type extends object = $type.Object>(
    updates: $type.PartialDeep<EtcConfig<Type>>,
    callback?: (etcConfig: $type.ReadonlyDeep<EtcConfig<Type>>) => void | Promise<void>,
): void => {
    const newEtcConfig = // Merges and deep freezes new etc configuration data.
        $obj.deepFreeze($obj.mergeClonesDeep(etcConfig(), updates)) as unknown as $type.ReadonlyDeep<EtcConfig<Type>>;

    $env.set('APP_ETC_CONFIG', newEtcConfig), etcConfig.flush();
    if (callback) void callback(newEtcConfig);
};
