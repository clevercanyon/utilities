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
export type RootR2OriginURLOptions = { parsed?: boolean };
export type RootR2BaseURLOptions = { parsed?: boolean };
export type R2OriginURLOptions = { parsed?: boolean };
export type R2BaseURLOptions = { parsed?: boolean };

export type Config<Type extends object = object> = $type.Object<Type>;
export type EtcConfig<Type extends object = object> = $type.Object<Type> & {
    user?: {
        anonId?: string;
        utxId?: string;
        utxAuthorId?: string;
        utxCustomerId?: string;

        authToken?: string;
        consent?: $user.ConsentData;
    };
};
export type UpdateConfigOptions<Type extends object = object> = {
    callback?: (config: $type.ReadonlyDeep<Config<Type>>) => void | Promise<void>;
};
export type UpdateEtcConfigOptions<Type extends object = object> = {
    callback?: (etcConfig: $type.ReadonlyDeep<EtcConfig<Type>>) => void | Promise<void>;
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
 * Checks if environment has an app’s root R2 origin URL.
 *
 * @returns True if environment has an app’s root R2 origin URL.
 */
export const hasRootR2OriginURL = $fnꓺmemo((): boolean => {
    return $env.get('APP_ROOT_R2_ORIGIN_URL') ? true : false;
});

/**
 * Gets current app’s root R2 origin URL.
 *
 * @param   options Options (all optional); {@see RootR2OriginURLOptions}.
 *
 * @returns         Current app’s root R2 origin URL.
 *
 * @note Unable to deep freeze a URL, but we would do so if possible.
 *       For now, we just declare it readonly using a TypeScript return type.
 */
export const rootR2OriginURL = $fnꓺmemo(
    { deep: true, maxSize: 2 },
    <Options extends RootR2OriginURLOptions>(options?: Options): Options extends RootR2OriginURLOptions & { parsed: true } ? $type.ReadonlyDeep<$type.URL> : string => {
        const opts = $obj.defaults({}, options || {}, { parsed: false }) as Required<RootR2OriginURLOptions>,
            value = $str.rTrim($env.get('APP_ROOT_R2_ORIGIN_URL', { type: 'string', require: true }), '/');

        return (opts.parsed ? $url.parse(value) : value) as ReturnType<typeof rootR2OriginURL<Options>>;
    },
);

/**
 * Checks if environment has an app’s root R2 base URL.
 *
 * @returns True if environment has an app’s root R2 base URL.
 */
export const hasRootR2BaseURL = $fnꓺmemo((): boolean => {
    return $env.get('APP_ROOT_R2_BASE_URL') || hasRootR2OriginURL() ? true : false;
});

/**
 * Gets current app’s root R2 base URL.
 *
 * @param   options Options (all optional); {@see RootR2BaseURLOptions}.
 *
 * @returns         Current app’s root R2 base URL.
 *
 * @note Unable to deep freeze a URL, but we would do so if possible.
 *       For now, we just declare it readonly using a TypeScript return type.
 */
export const rootR2BaseURL = $fnꓺmemo(
    { deep: true, maxSize: 2 },
    <Options extends RootR2BaseURLOptions>(options?: Options): Options extends RootR2BaseURLOptions & { parsed: true } ? $type.ReadonlyDeep<$type.URL> : string => {
        const opts = $obj.defaults({}, options || {}, { parsed: false }) as Required<RootR2BaseURLOptions>,
            value = $env.get('APP_ROOT_R2_BASE_URL', { type: 'string', default: '' }) || rootR2OriginURL() + '/app/' + pkgSlug() + '/';

        return (opts.parsed ? $url.parse(value) : value) as ReturnType<typeof rootR2BaseURL<Options>>;
    },
);

/**
 * Checks if environment has an app’s R2 origin URL.
 *
 * @returns True if environment has an app’s R2 origin URL.
 */
export const hasR2OriginURL = $fnꓺmemo((): boolean => {
    return $env.get('APP_R2_ORIGIN_URL') ? true : false;
});

/**
 * Gets current app’s R2 origin URL.
 *
 * @param   options Options (all optional); {@see R2OriginURLOptions}.
 *
 * @returns         Current app’s R2 origin URL.
 *
 * @note Unable to deep freeze a URL, but we would do so if possible.
 *       For now, we just declare it readonly using a TypeScript return type.
 */
export const r2OriginURL = $fnꓺmemo(
    { deep: true, maxSize: 2 },
    <Options extends R2OriginURLOptions>(options?: Options): Options extends R2OriginURLOptions & { parsed: true } ? $type.ReadonlyDeep<$type.URL> : string => {
        const opts = $obj.defaults({}, options || {}, { parsed: false }) as Required<R2OriginURLOptions>,
            value = $str.rTrim($env.get('APP_R2_ORIGIN_URL', { type: 'string', require: true }), '/');

        return (opts.parsed ? $url.parse(value) : value) as ReturnType<typeof r2OriginURL<Options>>;
    },
);

/**
 * Checks if environment has an app’s R2 base URL.
 *
 * @returns True if environment has an app’s R2 base URL.
 */
export const hasR2BaseURL = $fnꓺmemo((): boolean => {
    return $env.get('APP_R2_BASE_URL') || hasR2OriginURL() ? true : false;
});

/**
 * Gets current app’s R2 base URL.
 *
 * @param   options Options (all optional); {@see R2BaseURLOptions}.
 *
 * @returns         Current app’s R2 base URL.
 *
 * @note Unable to deep freeze a URL, but we would do so if possible.
 *       For now, we just declare it readonly using a TypeScript return type.
 */
export const r2BaseURL = $fnꓺmemo(
    { deep: true, maxSize: 2 },
    <Options extends R2BaseURLOptions>(options?: Options): Options extends R2BaseURLOptions & { parsed: true } ? $type.ReadonlyDeep<$type.URL> : string => {
        const opts = $obj.defaults({}, options || {}, { parsed: false }) as Required<R2BaseURLOptions>,
            value = $env.get('APP_R2_BASE_URL', { type: 'string', default: '' }) || r2OriginURL() + '/app/' + pkgSlug() + '/';

        return (opts.parsed ? $url.parse(value) : value) as ReturnType<typeof r2BaseURL<Options>>;
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
export const config = $fnꓺmemo(<Type extends object = object>(): Config<Type> => {
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
 * - An app’s normal configuration is typically maintained by the app’s user; i.e., configured by user.
 * - An app’s etc configuration is typically maintained by the app; e.g., storage of a user’s consent preferences.
 *
 * @returns Current app’s etc configuration data, frozen deeply.
 *
 * @note Cache is flushed by {@see updateEtcConfig()}.
 */
export const etcConfig = $fnꓺmemo(<Type extends object = object>(): EtcConfig<Type> => {
    return $obj.deepFreeze($env.get('APP_ETC_CONFIG', { type: 'object', default: {} })) as EtcConfig<Type>;
});

/**
 * Updates current app’s configuration.
 *
 * @param updates Updates to merge in; {@see Config}.
 * @param options All optional; {@see UpdateConfigOptions}.
 */
export const updateConfig = async <Type extends object>(updates: $type.PartialDeep<Config<Type>>, options?: UpdateConfigOptions<Type>): Promise<void> => {
    const opts = $obj.defaults({}, options || {}) as UpdateConfigOptions<Type>,
        newConfig = $obj.deepFreeze($obj.mergeClonesDeep(config(), updates)) as unknown as $type.ReadonlyDeep<Config<Type>>;

    $env.set('APP_CONFIG', newConfig), config.flush();
    if (opts.callback) await opts.callback(newConfig);
};

/**
 * Updates current app’s etc configuration.
 *
 * @param updates Updates to merge in; {@see EtcConfig}.
 * @param options All optional; {@see UpdateEtcConfigOptions}.
 */
export const updateEtcConfig = async <Type extends object>(updates: $type.PartialDeep<EtcConfig<Type>>, options?: UpdateEtcConfigOptions<Type>): Promise<void> => {
    const opts = $obj.defaults({}, options || {}) as UpdateEtcConfigOptions<Type>,
        newEtcConfig = $obj.deepFreeze($obj.mergeClonesDeep(etcConfig(), updates)) as unknown as $type.ReadonlyDeep<EtcConfig<Type>>;

    $env.set('APP_ETC_CONFIG', newEtcConfig), etcConfig.flush();
    if (opts.callback) await opts.callback(newEtcConfig);
};
