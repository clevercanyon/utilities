/**
 * No module preload plugin.
 *
 * Vite is not aware of this config file's location.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 */

/**
 * Configures no module preload plugin.
 *
 * @param   props Props from vite config file driver.
 *
 * @returns       No module preload plugin.
 */
export default async (/* {} */) => {
    const virtualId = 'vite/preload-helper.js';
    const resolvedVirtualId = '\0' + virtualId;

    return {
        name: 'vite-plugin-c10n-no-module-preload',
        enforce: 'pre', // Before Vite loads this virtual module.
        // {@see https://vite.dev/guide/using-plugins.html#enforcing-plugin-ordering}.
        // {@see https://vite.dev/guide/api-plugin.html#plugin-ordering}.

        load: {
            order: 'pre',
            handler: (id) => {
                if (id === resolvedVirtualId) {
                    return 'export const __vitePreload = (dynamicImport, preloadableDeps) => dynamicImport();';
                }
            },
        },
    };
};
