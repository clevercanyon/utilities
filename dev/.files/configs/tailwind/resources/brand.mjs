/**
 * Tailwind brand acquisition.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 *
 * @internal Jiti, which is used by Tailwind to load ESM config files, doesn’t support top-level await and does not support
 * `import.meta.url`. Thus, we cannot use async functionality here, and we cannot use our `u` (utilities). Therefore, we
 * produce an extremely watered-down version of our utilities specifically for Tailwind config files.
 */

import { execSync } from 'node:child_process';
import { $brand, $env, $fn, $json, $str } from '../../../../../node_modules/@clevercanyon/utilities/dist/index.js';
import u from './utilities.mjs';

// `__dirname` already exists when loaded by Tailwind via Jiti / commonjs.
// eslint-disable-next-line no-undef -- `__dirname` is not actually missing.
const ___dirname = __dirname; // Current directory.

/**
 * Acquires app’s brand object instance.
 *
 * @returns App’s brand; {@see $brand.get()}.
 */
export default /* not async compatible */ () => {
    /**
     * Gets brand object instance.
     */
    let brand = $fn.try(() => $brand.get(u.pkgName), undefined)();
    if (brand) return brand; // That was’t such a chore, now was it?

    const mode = $env.get('_VITE_MODE_', { type: 'string' }) || 'prod';

    const baseURL = // Acquires base URL, from Vite, if possible.
        $env.get('_VITE_APP_BASE_URL_', { type: 'string' }) || // Mode-aware base URL.
        $str.trim(execSync("./cli-sync/base-url.mjs '" + mode + "'", { cwd: ___dirname }).toString());

    if (!mode || !baseURL) return; // Not possible; e.g., app has no base URL.

    const brandConfig = $json.parse(execSync("./cli-sync/brand-config.mjs '" + mode + "' '" + baseURL + "'", { cwd: ___dirname }).toString());
    if (!brandConfig) throw new Error('Missing brand config for Tailwind themes.');

    return $brand.addApp({ pkgName: u.pkgName, baseURL, props: brandConfig });
};
