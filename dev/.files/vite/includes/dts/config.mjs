/**
 * DTS config file.
 *
 * DTS is not aware of this config file's location.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 *
 * @see https://github.com/trapcodeio/vite-plugin-ejs
 */

/**
 * Configures DTS for Vite.
 *
 * @param   props Props from vite config file driver.
 *
 * @returns       DTS configuration.
 */
export default async ({ distDir }) => {
    return (await import('vite-plugin-dts')).default({
        logLevel: 'error',
        outDir: distDir + '/types',
    });
};
