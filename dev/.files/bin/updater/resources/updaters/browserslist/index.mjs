/**
 * `./.browserslistrc` updater.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 *
 * - browserslist-generator: <https://o5p.me/4DC1Vq>.
 * - Browserlist report on production config: <https://o5p.me/Fvs3WP>.
 * - Transpiler: <https://esbuild.github.io/content-types/#javascript>.
 */

import { browsersWithSupportForEcmaVersion } from 'browserslist-generator';
import fs from 'node:fs';
import path from 'node:path';
import { $str, $time } from '../../../../../../../node_modules/@clevercanyon/utilities/dist/index.js';
import u from '../../../../../resources/utilities.mjs';
import generatedRegExp from '../../generated-regexp.mjs';

/**
 * Updates `./.browserslistrc` file.
 *
 * WARNING: In this file, don't use anything from our `u` (utilities) package that resolves relative directory paths
 * and/or derives information from relative directory paths, without first calling `u.switchProjDir()` to properly
 * prepare utilities. When this file is called upon, it is passed a `projDir` explicitly. This file should only operate
 * on that project directory. Also, don't forget to `u.restoreProjDir()`, to restore the previous project directory.
 */
export default async ({ projDir }) => {
    /**
     * Switches to `projDir`.
     */
    await u.switchProjDir(projDir);

    /**
     * Initializes vars.
     */
    const browserslistrcFile = path.resolve(u.projDir, './.browserslistrc');

    /**
     * Defines environment contents.
     *
     * - `production` is an established default that many tools use when `NODE_ENV=production`.
     * - `development` is an established default that many tools use when `NODE_ENV=development`.
     * - The other environments correlate with our target build environments.
     */
    let browserslistrcFileContentsEnvs = $str.dedent(`
        # Last generated ${$time.now().toProse()}.
    `);
    for (const targetEnv of ['production', 'development', 'any', 'node', 'cfw', 'cfp', 'web', 'webw']) {
        switch (targetEnv) {
            default: {
                browserslistrcFileContentsEnvs += '\n\n[' + targetEnv + ']';
            }
        }
        switch (targetEnv) {
            case 'production':
            case 'development':
            case 'any':
            case 'node': {
                browserslistrcFileContentsEnvs += '\n' + 'node >= ' + u.node.version.current;
                break;
            }
        }
        switch (targetEnv) {
            case 'production':
            case 'development':
            case 'any':
            case 'web':
            case 'webw': {
                browserslistrcFileContentsEnvs += '\n' + browsersWithSupportForEcmaVersion(u.es.version.lcnYear).join('\n');
                break;
            }
        }
        switch (targetEnv) {
            case 'cfw':
            case 'cfp': {
                browserslistrcFileContentsEnvs += '\n' + 'last 1 chrome versions';
                break;
            }
        }
        switch (targetEnv) {
            default: {
                browserslistrcFileContentsEnvs += '\n' + 'not dead';
            }
        }
    }

    /**
     * Defines `./.browserslistrc` file contents.
     */
    const oldFileContents = fs.readFileSync(browserslistrcFile).toString();
    const browserslistrcFileContents = oldFileContents.replace(
        generatedRegExp,
        ($_, $1, $2, $3) =>
            $1 + //
            '\n\n' +
            browserslistrcFileContentsEnvs +
            '\n\n' +
            $3,
    );

    /**
     * Compiles `./.browserslistrc` file contents.
     */
    fs.writeFileSync(browserslistrcFile, browserslistrcFileContents);

    /**
     * Restores previous project directory.
     */
    await u.restoreProjDir();
};
