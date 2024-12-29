/**
 * Vite config file.
 *
 * Vite is not aware of this config file's location.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 *
 * @see https://vitejs.dev/config/
 */

import fs from 'node:fs';
import path from 'node:path';
import { createLogger, loadEnv } from 'vite';
import { $fs, $glob } from '../../../node_modules/@clevercanyon/utilities.node/dist/index.js';
import { $is, $json, $obj, $obp, $str, $time, $url } from '../../../node_modules/@clevercanyon/utilities/dist/index.js';
import esVersion from '../bin/includes/es-version.mjs';
import extensions from '../bin/includes/extensions.mjs';
import importAliases from '../bin/includes/import-aliases.mjs';
import u from '../bin/includes/utilities.mjs';
import viteA16sDir from './includes/a16s/dir.mjs';
import viteC10nBrandConfig from './includes/c10n/brand-config.mjs';
import viteC10nCloudflareEmail from './includes/c10n/cloudflare-email.mjs';
import viteC10nCloudflareSockets from './includes/c10n/cloudflare-sockets.mjs';
import viteC10nHTMLTransformsConfig from './includes/c10n/html-transforms.mjs';
import viteC10nNoModulePreloadConfig from './includes/c10n/no-module-preload.mjs';
import viteC10nPostProcessingConfig from './includes/c10n/post-processing.mjs';
import viteC10nPreProcessingConfig from './includes/c10n/pre-processing.mjs';
import viteC10nSideEffectsConfig from './includes/c10n/side-effects.mjs';
import viteDTSConfig from './includes/dts/config.mjs';
import viteEJSConfig from './includes/ejs/config.mjs';
import viteESBuildConfig from './includes/esbuild/config.mjs';
import viteIconsConfig from './includes/icons/config.mjs';
import viteMDXConfig from './includes/mdx/config.mjs';
import viteMDXESBuildConfig from './includes/mdx/esbuild.mjs';
import viteMinifyConfig from './includes/minify/config.mjs';
import vitePkgUpdates from './includes/package/updates.mjs';
import vitePrefreshConfig from './includes/prefresh/config.mjs';
import viteRollupConfig from './includes/rollup/config.mjs';
import viteTerserConfig from './includes/terser/config.mjs';
import viteVitestConfig from './includes/vitest/config.mjs';

/**
 * Defines Vite configuration.
 *
 * @param   vite Data passed in by Vite.
 *
 * @returns      Vite configuration object properties.
 */
export default async ({ mode, command, isSsrBuild: isSSRBuild }) => {
    /**
     * Acquires current time.
     */
    const time = $time.now();

    /**
     * Configures `NODE_ENV` environment variable.
     */
    process.env.NODE_ENV = // As detailed by Vite <https://o5p.me/DscTVM>.
		'dev' === mode ? 'development' // Enforce development mode.
		: 'production'; // prettier-ignore

    /**
     * Configures `APP_IS_VITE` environment variable.
     *
     * @note The `APP_` prefix ensures Vite picks this up and adds it to app builds.
     *       This can be useful, as it allows us to detect, within our app,
     *       whether the Vite dev server is currently running.
     */
    process.env.APP_IS_VITE = command + '=' + mode;

    /**
     * Directory vars.
     */
    const __dirname = $fs.imuDirname(import.meta.url);
    const projDir = path.resolve(__dirname, '../../..');
    const srcDir = path.resolve(__dirname, '../../../src');
    const cargoDir = path.resolve(__dirname, '../../../src/cargo');
    const distDir = path.resolve(__dirname, '../../../dist');
    const envsDir = path.resolve(__dirname, '../../../dev/.envs');
    const logsDir = path.resolve(__dirname, '../../../dev/.logs');
    const a16sDir = await viteA16sDir({ isSSRBuild, distDir });

    /**
     * Properties of `./package.json` file.
     */
    const pkg = await u.pkg(); // Parses `./package.json`.

    /**
     * Environment-related vars.
     */
    let appEnvPrefixes = ['APP_']; // Added to all builds.
    if (isSSRBuild) appEnvPrefixes.push('SSR_APP_'); // Added to SSR builds.
    const env = loadEnv(mode, envsDir, appEnvPrefixes); // Includes `APP_IS_VITE` from above.

    const appBaseURL = env.APP_BASE_URL || '';
    // A trailing slash or no trailing slash — it does matter!
    // e.g., `new URL('./', 'https://example.com/')` = `https://example.com/`.
    // e.g., `new URL('./', 'https://example.com/base')` = `https://example.com/`.
    // e.g., `new URL('./', 'https://example.com/base/')` = `https://example.com/base/`.
    // We leave it up to an implementation to decide what type of base URL it prefers to use.
    // A base URL is only required for some app types; e.g., `spa|mpa`. See validations below.

    // This is a variant of the base URL that’s resolved and has no trailing slash.
    const appBaseURLResolvedNTS = appBaseURL ? $str.rTrim(new URL('./', appBaseURL).toString(), '/') : '';

    // No other choice at this time, we have to store these in environment variables for Tailwind configuration.
    process.env._VITE_MODE_ = mode; // Informs brand acquisition in our Tailwind configuration file.
    process.env._VITE_APP_BASE_URL_ = appBaseURL; // Informs brand acquisition.

    const staticDefs = {
        ['$$__' + appEnvPrefixes[0] + 'PKG_NAME__$$']: pkg.name || '',
        ['$$__' + appEnvPrefixes[0] + 'PKG_VERSION__$$']: pkg.version || '',

        ['$$__' + appEnvPrefixes[0] + 'BUILD_TIME_YMD__$$']: time.toYMD(),
        ['$$__' + appEnvPrefixes[0] + 'BUILD_TIME_SQL__$$']: time.toSQL(),
        ['$$__' + appEnvPrefixes[0] + 'BUILD_TIME_ISO__$$']: time.toISO(),
        ['$$__' + appEnvPrefixes[0] + 'BUILD_TIME_STAMP__$$']: time.unix().toString(),

        ['$$__' + appEnvPrefixes[0] + 'BASE_URL__$$']: appBaseURL,
        ['$$__' + appEnvPrefixes[0] + 'BASE_URL_RESOLVED_NTS__$$']: appBaseURLResolvedNTS,
    };
    Object.keys(env) // Add string env vars to static defines.
        .filter((key) => new RegExp('^(?:' + appEnvPrefixes.map((v) => $str.escRegExp(v)).join('|') + ')', 'u').test(key))
        .filter((key) => $is.string($str.parseValue(env[key])) /* Only those which are truly string values. */)
        .forEach((key) => (staticDefs['$$__' + key + '__$$'] = env[key]));

    /**
     * App type, target, path, and related vars.
     */
    const appType = $obp.get(pkg, 'config.c10n.&.' + (isSSRBuild ? 'ssrBuild' : 'build') + '.appType') || 'cma';
    const targetEnv = $obp.get(pkg, 'config.c10n.&.' + (isSSRBuild ? 'ssrBuild' : 'build') + '.targetEnv') || 'any';
    const entryFiles = $obp.get(pkg, 'config.c10n.&.' + (isSSRBuild ? 'ssrBuild' : 'build') + '.entryFiles') || [];
    const sideEffects = $obp.get(pkg, 'config.c10n.&.' + (isSSRBuild ? 'ssrBuild' : 'build') + '.sideEffects') || [];

    const appDefaultEntryFiles = // Based on app type.
        ['spa'].includes(appType) ? ['./src/index.' + extensions.asBracedGlob([...extensions.byCanonical.html])]
        : ['mpa'].includes(appType) ? ['./src/**/index.' + extensions.asBracedGlob([...extensions.byCanonical.html])]
        : ['./src/*.' + extensions.asBracedGlob([...extensions.byDevGroup.sTypeScript, ...extensions.byDevGroup.sTypeScriptReact])]; // prettier-ignore

    const appEntryFiles = (entryFiles.length ? entryFiles : appDefaultEntryFiles).map((v) => $str.lTrim(v, './'));
    const appEntries = appEntryFiles.length ? await $glob.promise(appEntryFiles, { cwd: projDir }) : [];

    const appEntriesAsProjRelPaths = appEntries.map((absPath) => './' + path.relative(projDir, absPath));
    const appEntriesAsSrcSubpaths = appEntries.map((absPath) => path.relative(srcDir, absPath));
    const appEntriesAsSrcSubpathsNoExt = appEntriesAsSrcSubpaths.map((subpath) => subpath.replace(/\.[^.]+$/u, ''));

    /**
     * SSL certificates.
     */
    const sslKey = fs.readFileSync(path.resolve(projDir, './dev/.files/bin/ssl-certs/i10e-ca-key.pem')).toString();
    const sslCrt = fs.readFileSync(path.resolve(projDir, './dev/.files/bin/ssl-certs/i10e-ca-crt.pem')).toString();

    /**
     * Other misc. configuration properties.
     */
    const peerDepKeys = Object.keys(pkg.peerDependencies || {});
    const targetEnvIsServer = ['cfw', 'node'].includes(targetEnv);
    const wranglerMode = process.env.VITE_WRANGLER_MODE || ''; // Wrangler mode.
    const inProdLikeMode = ['prod', 'stage'].includes(mode) || ('dev' === mode && 'dev' === wranglerMode);
    const sourcemapsEnable = ['dev'].includes(mode); // Only generate sourcemaps when explicitly in dev mode.
    const minifyEnable = !['lib'].includes(appType) && inProdLikeMode; // We don’t ever minify code in a library.
    const vitestSandboxEnable = process.env.VITEST && $str.parseValue(String(process.env.VITEST_SANDBOX_ENABLE || ''));
    const vitestExamplesEnable = process.env.VITEST && $str.parseValue(String(process.env.VITEST_EXAMPLES_ENABLE || ''));
    const prefreshEnable = process.env.VITE_PREFRESH_ENABLE && !process.env.VITEST && 'serve' === command && 'dev' === mode && ['spa', 'mpa'].includes(appType);

    /**
     * Validates all of the above.
     */
    if (!pkg.name) {
        throw new Error('Apps must have a name.');
    }
    if (!appEntryFiles.length || !appEntries.length) {
        throw new Error('Apps must have at least one entry point.');
    }
    if (isSSRBuild && !targetEnvIsServer) {
        throw new Error('SSR builds must target an SSR environment.');
    }
    if (!['dev', 'ci', 'stage', 'prod'].includes(mode)) {
        throw new Error('Required `mode` is missing or invalid. Expecting `dev|ci|stage|prod`.');
    }
    if (!['spa', 'mpa', 'cma', 'lib'].includes(appType)) {
        throw new Error('Must have a valid `config.c10n.&.build.appType` in `package.json`.');
    }
    if ((['spa', 'mpa'].includes(appType) || (['cfw'].includes(targetEnv) && !['lib'].includes(appType))) && !appBaseURL) {
        throw new Error('Must have a valid `APP_BASE_URL` environment variable.');
    }
    if (!['any', 'node', 'cfw', 'cfp', 'web', 'webw'].includes(targetEnv)) {
        throw new Error('Must have a valid `config.c10n.&.build.targetEnv` in `package.json`.');
    }

    /**
     * Performs `./package.json` property updates.
     */
    const pkgUpdates = await vitePkgUpdates({
        command, isSSRBuild, projDir, srcDir, distDir, pkg, appType, targetEnv, sideEffects,
        appEntriesAsProjRelPaths, appEntriesAsSrcSubpaths, appEntriesAsSrcSubpathsNoExt
    }); // prettier-ignore

    /**
     * Updates `sideEffects` to full set established by package update routines.
     */
    (sideEffects.length = 0), pkgUpdates.sideEffects.forEach((s) => sideEffects.push(s));

    /**
     * Configures plugins for Vite.
     */
    const plugins = [
        await viteC10nSideEffectsConfig({}),
        await viteC10nNoModulePreloadConfig({}),

        await viteIconsConfig({}),
        await viteC10nBrandConfig({ mode, appBaseURL }),
        await viteC10nCloudflareEmail({ mode, command }),
        await viteC10nCloudflareSockets({ mode, command }),
        //
        await viteMDXConfig({ projDir }),
        await viteEJSConfig({ mode, projDir, srcDir, pkg, env }),
        await viteC10nHTMLTransformsConfig({ staticDefs }),
        //
        await viteMinifyConfig({ minifyEnable }),
        await viteDTSConfig({ isSSRBuild, distDir }),
        //
        await viteC10nPreProcessingConfig({ command, isSSRBuild, projDir, distDir, appType }),
        await viteC10nPostProcessingConfig({
            mode, wranglerMode, inProdLikeMode, command, isSSRBuild, projDir, distDir,
            pkg, env, appBaseURL, appType, targetEnv, staticDefs, pkgUpdates
        }), // prettier-ignore
        ...(prefreshEnable ? [await vitePrefreshConfig({})] : []),
    ];

    /**
     * Configures esbuild for Vite.
     */
    const esbuildConfig = await viteESBuildConfig({}); // Minimal config. No props at this time.

    /**
     * Configures terser for Vite.
     */
    const terserConfig = await viteTerserConfig({}); // Minimal config. No props passed at this time.

    /**
     * Configures rollup for Vite.
     */
    const rollupConfig = await viteRollupConfig({ projDir, srcDir, distDir, a16sDir, appType, appEntries, peerDepKeys, minifyEnable, sideEffects });

    /**
     * Configures tests for Vite.
     */
    const vitestConfig = await viteVitestConfig({ srcDir, logsDir, targetEnv, vitestSandboxEnable, vitestExamplesEnable, rollupConfig });

    /**
     * Configures imported workers.
     */
    const importedWorkerPlugins = () => []; // No worker plugins at this time.
    const importedWorkerRollupConfig = { ...$obj.omit(rollupConfig, ['input']) };

    /**
     * Custom logger.
     */
    const customLogger = createLogger();
    const originalLoggerWarnOnce = customLogger.warnOnce;

    customLogger.warnOnce = (msg, options) => {
        if (msg.includes("didn't resolve at build time, it will remain unchanged to be resolved at runtime")) {
            return; // Safe to ignore. Some of our CSS resources, for example, reference cargo assets.
            // Cargo assets can only be resolved at runtime. There’s no need for this warning; we are aware.
        }
        if (/^Sourcemap for "[^"]+\.mdx" points to missing source files$/iu.test(msg)) {
            return; // Safe to ignore. Some MDX glob imports contain query strings, which makes the filesystem path unreachable.
            // This is a consequence of us needing to create a distinct import for frontMatter. See `importGlobRestoreExtension` below.
        }
        originalLoggerWarnOnce(msg, options);
    };

    /**
     * Base config for Vite.
     *
     * @see https://vitejs.dev/config/
     */
    const baseConfig = {
        c10n: { pkg, pkgUpdates },
        define: $obj.map(staticDefs, (v) => $json.stringify(v)),

        root: srcDir, // Absolute path where entry indexes live.
        publicDir: isSSRBuild ? false : path.relative(srcDir, cargoDir),
        base: appBaseURLResolvedNTS ? $url.toPath(appBaseURLResolvedNTS) : '/',

        envDir: path.relative(srcDir, envsDir), // Relative to `root` directory.
        envPrefix: appEnvPrefixes, // Env vars w/ these prefixes become part of the app.

        appType: ['spa', 'mpa'].includes(appType) ? appType : 'custom',
        plugins, // Additional Vite plugins; i.e., already configured above.

        server: {
            host: '0.0.0.0', // All.
            port: 443, // Default https.
            strictPort: true, // Only use 443.
            open: false, // Not automatically.
            https: { key: sslKey, cert: sslCrt },
        },
        preview: {
            host: '0.0.0.0', // All.
            port: 443, // Default https.
            strictPort: true, // Only use 443.
            open: false, // Not automatically.
            https: { key: sslKey, cert: sslCrt },
        },
        resolve: {
            alias: importAliases.asFindReplaceRegExps,
            extensions: [...extensions.onImportWithNoExtensionTry],
        },
        worker: /* <https://vitejs.dev/guide/features.html#web-workers> */ {
            format: 'es',
            plugins: importedWorkerPlugins,
            rollupOptions: importedWorkerRollupConfig,
        },
        ssr: {
            target: targetEnvIsServer && ['cfw'].includes(targetEnv) ? 'webworker' : 'node',
            ...(targetEnvIsServer && ['cfw'].includes(targetEnv) ? { noExternal: true } : {}),
        },
        optimizeDeps: {
            force: true, // Don’t use cache for optimized deps; recreate.
            esbuildOptions: {
                external: ['cloudflare:sockets'],
                plugins: [await viteMDXESBuildConfig({ projDir })],
            },
            // Preact is required by prefresh plugin; {@see https://o5p.me/WmuefH}.
            ...(prefreshEnable ? { include: ['preact', 'preact/jsx-runtime', 'preact/hooks', 'preact/compat', '@preact/signals'] } : {}),
        },
        esbuild: esbuildConfig, // esBuild config options.

        build: /* <https://vitejs.dev/config/build-options.html> */ {
            target: esVersion.lcnYear, // Matches TypeScript config.
            ssr: targetEnvIsServer, // Target environment is server-side?

            emptyOutDir: false, // Instead, we handle this via our own plugin.
            outDir: path.relative(srcDir, distDir), // Relative to `root` directory.

            assetsInlineLimit: 0, // Disable entirely. Use import `?raw`, `?url`, etc.
            assetsDir: path.relative(distDir, a16sDir), // Relative to `outDir` directory.
            // Note: `a16s` is a numeronym for 'acquired resources'; i.e. via imports.

            manifest: !isSSRBuild ? 'vite/manifest.json' : false, // Enables manifest of asset locations.
            ssrManifest: isSSRBuild ? 'vite/ssr-manifest.json' : false, // Enables SSR manifest of asset locations.
            sourcemap: sourcemapsEnable, // Enables creation of sourcemaps; i.e., purely for debugging purposes.

            terserOptions: terserConfig, // Terser config options.
            minify: minifyEnable ? 'terser' : false, // {@see https://o5p.me/pkJ5Xz}.
            cssMinify: minifyEnable ? 'lightningcss' : false, // {@see https://o5p.me/h0Hgj3}.
            // We ran several tests between `esbuild`, `cssnano`, and `lightningcss` wins.

            modulePreload: false, // Disable. DOM injections conflict with our SPAs.
            // This option is sort-of respected, but not fully; {@see https://github.com/vitejs/vite/issues/13952}.
            // For now, we have a custom plugin, configured above, which effectively disables all preloading.

            ...(['cma', 'lib'].includes(appType) ? { lib: { entry: appEntries, formats: ['es'] } } : {}),
            rollupOptions: rollupConfig, // See: <https://o5p.me/5Vupql>.
        },
        customLogger, // Uses our custom logger, which is based on the default logger.
        experimental: {
            importGlobRestoreExtension: true, // Restores file extension on glob imports containing a query string.
            // This is needed by our use of the MDX plugin for Vite; e.g., when we glob MDX files to import frontMatter,
            // we add a query to make the glob import distinct from other dynamic imports of the same file elsewhere.
            // Enabling this option restores the `.mdx` extension, such that the MDX plugin still considers
            // the import to be an MDX file; i.e., given that it ends with a query string otherwise.

            // Another way to accomplish the same thing is to set the query string to a value that ends with `.mdx`.
            // Just documenting this for future reference in case the experimental option goes away or changes.
        },
        test: vitestConfig, // Vitest configuration.
    };

    /**
     * Returns base config for Vite.
     */
    return baseConfig;
};
