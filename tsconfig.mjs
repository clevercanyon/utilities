/**
 * TypeScript config file.
 *
 * TypeScript is not aware of this config file's location.
 *
 * The underlying `./tsconfig.json` file can be recompiled using:
 *
 *     $ madrun update tsconfig
 *     or: $ madrun update dotfiles
 *
 * @note CUSTOM EDITS ONLY PLEASE!
 * @note In the future this file will be updated automatically.
 * @note Only `<custom:start.../custom:end>` will be preserved below.
 */

import baseConfig from './dev/.files/typescript/config.mjs';
import { $obj } from './node_modules/@clevercanyon/utilities/dist/index.js';

/*
 * Customizations.
 * <custom:start> */

export default await (async () => {
	return $obj.mergeDeep({}, await baseConfig(), {
		compilerOptions: {
			$concat: {
				lib: ['dom', 'webworker'],
				types: [
					'@types/node', //
					'@types/luxon',
					'@types/semver',
					'@types/micromatch',
					'@types/libsodium-wrappers',
				],
			},
		},
	});
})();

/* </custom:end> */
