/**
 * Path utilities.
 */

import type { Ignore as GitIgnore } from 'ignore';
import { default as untypedGitIgnoreFactory } from 'ignore';
import type { Options as MMOptions } from 'micromatch';
import { exts as $mimeꓺexts, types as $mimeꓺtypes } from './mime.ts';
import { defaults as $objꓺdefaults, hasOwn as $objꓺhasOwn } from './obj.ts';
import { mm as $strꓺmm, rTrim as $strꓺrTrim } from './str.ts';
import { castArray as $toꓺcastArray } from './to.ts';

type GitIgnoreFactoryOptions = { ignorecase?: boolean };
const gitIgnoreFactory = untypedGitIgnoreFactory as unknown as (options: GitIgnoreFactoryOptions) => GitIgnore;

/**
 * Defines types.
 */
export type { GitIgnore };
export type GitIgnoreOptions = {
	ignoreCase?: boolean;
	useDefaultGitIgnores?: boolean;
	useDefaultNPMIgnores?: boolean;
};
export type GlobToRegExpOptions = MMOptions & { ignoreCase?: boolean };
export type globToRegExpStringOptions = MMOptions & { ignoreCase?: boolean };

export type DefaultGitIgnoresByGroup = { [x: string]: { [x: string]: string[] } | string[] };
export type DefaultNPMIgnoresByGroup = { [x: string]: { [x: string]: string[] } | string[] };

/**
 * Defines a braced dot globstars pattern.
 *
 * @note This braced pattern explicitly includes dots.
 */
export const bracedDotGlobstars = '{**/*,**/.*,**/.*/**/*,**/.*/**/.*}';

/**
 * Any extension RegExp.
 *
 * @note Matches unnamed dots also; e.g., `.[ext]`.
 */
export const extRegExp = /(?:^|[^.])\.([^\\/.]+)$/iu;

/**
 * Static extensions.
 *
 * @note Everything except backend code used for web proramming.
 *
 * @see $mimeꓺexts in `./mime.ts` for a more verbose breakdown of these.
 */
export const staticExts: string[] = $mimeꓺexts.filter((ext) => {
	return (
		!['php', 'phtm', 'phtml', 'rb', 'py', 'shtm', 'shtml', 'asp', 'aspx', 'pl', 'plx', 'cgi', 'ppl', 'perl', 'sh', 'zsh', 'bash'].includes(ext) &&
		!/^(?:php|phtml?|rb|py|shtml?|aspx?|plx?|cgi|ppl|perl|sh|zsh|bash)(?:[.~_-]*[0-9]+)$/u.test(ext) // Version-specific variants.
	);
});

/**
 * Static extensions piped for use in RegExp.
 */
export const staticExtsPipedForRegExp = staticExts.join('|');

/**
 * Static extension RegExp.
 *
 * @note Matches unnamed dots also; e.g., `.[ext]`.
 */
export const staticExtRegExp = new RegExp('(?:^|[^.])\\.(' + staticExtsPipedForRegExp + ')$', 'iu');

/**
 * Cleans a filesystem path.
 *
 * @param   path Path to clean.
 *
 * @returns      Clean filesystem path.
 */
export const clean = (path: string): string => {
	return path.split(/[?#]/u)[0];
};

/**
 * Gets a path’s extension.
 *
 * @param   path Path to consider.
 *
 * @returns      Extension; else empty string.
 */
export const ext = (path: string): string => {
	path = clean(path); // No query and/or hash.
	return '' !== path ? extRegExp.exec(path)?.[1].toLowerCase() || '' : '';
};

/**
 * Checks if path has an extension.
 *
 * @param   path Path to consider.
 *
 * @returns      True if path has an extension.
 */
export const hasExt = (path: string): boolean => {
	path = clean(path); // No query and/or hash.
	return '' !== path && extRegExp.test(path);
};

/**
 * Checks if path has a static extension.
 *
 * @param   path Path to consider.
 *
 * @returns      True if path has a static extension.
 */
export const hasStaticExt = (path: string): boolean => {
	path = clean(path); // No query and/or hash.
	return '' !== path && extRegExp.test(path) && staticExtRegExp.test(path);
};

/**
 * Exports git ignore factory w/ enhancements.
 *
 * @param options Options (all optional); {@see GitIgnoreOptions}.
 *
 * @see https://o5p.me/X7mPw2
 */
export const newGitIgnore = (options?: GitIgnoreOptions): GitIgnore => {
	const defaultOpts = {
		ignoreCase: true,
		useDefaultGitIgnores: true,
		useDefaultNPMIgnores: false,
	};
	const opts = $objꓺdefaults({}, options || {}, defaultOpts) as Required<GitIgnoreOptions>;
	if (opts.useDefaultNPMIgnores /* Already includes git ignores. */) opts.useDefaultGitIgnores = false;

	const gitIgnore = gitIgnoreFactory({ ignorecase: opts.ignoreCase });

	if (opts.useDefaultGitIgnores) {
		gitIgnore.add(defaultGitIgnores);
	}
	if (opts.useDefaultNPMIgnores) {
		gitIgnore.add(defaultNPMIgnores);
	}
	return gitIgnore;
};

/**
 * Converts a `.gitignore` entry into a fast-glob pattern.
 *
 * @param   gitIgnore Git ignore entry.
 *
 * @returns           Standard fast-glob pattern.
 *
 * @note Relativity is not altered here. Please consider relativity in your implementation
 *
 * @see https://git-scm.com/docs/gitignore#_pattern_format.
 */
export const gitIgnoreToGlob = (ignoreGlob: string): string => {
	const isNegated = /^!/u.test(ignoreGlob);
	const isRootPath = /^!?\//u.test(ignoreGlob);
	const isRelativePath = /\//u.test(ignoreGlob);

	if (isNegated /* Remove temporarily. */) {
		ignoreGlob = ignoreGlob.replace(/^!/u, '');
	}
	ignoreGlob = $strꓺrTrim(ignoreGlob, '/');

	if (isRootPath || isRelativePath) {
		return (isNegated ? '!' : '') + ignoreGlob + '/**';
	}
	return (isNegated ? '!' : '') + '**/' + ignoreGlob + '/**';
};

/**
 * Converts a glob into a regular expression.
 *
 * @param   glob    Glob to convert into a regular expression.
 * @param   options Options (all optional); {@see GlobToRegExpOptions}.
 *
 * @returns         Glob as a regular expression.
 *
 * @option-deprecated 2023-09-16 `nocase` option deprecated in favor of `ignoreCase`. The `nocase` option will continue to
 *   work, however, as it’s part of the micromatch library that powers this utility. We just prefer to use `ignoreCase`,
 *   in order to be consistent with other utilities we offer that have the option to ignore caSe.
 */
export const globToRegExp = (glob: string, options?: GlobToRegExpOptions): RegExp => {
	const opts = $objꓺdefaults({}, options || {}, { nocase: false }) as GlobToRegExpOptions;

	if ($objꓺhasOwn(opts, 'ignoreCase')) {
		opts.nocase = opts.ignoreCase;
		delete opts.ignoreCase;
	}
	return $strꓺmm.makeRe(glob, opts);
};

/**
 * Converts a glob into a regular expression string.
 *
 * @param   glob    Glob to convert into a regular expression string.
 * @param   options Options (all optional); {@see globToRegExpStringOptions}.
 *
 * @returns         Glob as a regular expression string.
 *
 * @option-deprecated 2023-09-16 `nocase` option deprecated in favor of `ignoreCase`. The `nocase` option will continue to
 *   work, however, as it’s part of the micromatch library that powers this utility. We just prefer to use `ignoreCase`,
 *   in order to be consistent with other utilities we offer that have the option to ignore caSe.
 */
export const globToRegExpString = (glob: string, options?: globToRegExpStringOptions): string => {
	const opts = $objꓺdefaults({}, options || {}, { nocase: false }) as globToRegExpStringOptions;

	if ($objꓺhasOwn(opts, 'ignoreCase')) {
		opts.nocase = opts.ignoreCase;
		delete opts.ignoreCase;
	}
	return $strꓺmm
		.makeRe(glob, opts)
		.toString()
		.replace(/^\/|\/[^/]*$/gu, '');
};

/**
 * Gets VS Code language extensions.
 *
 * @param   vsCodeLangs VS Code language ID(s).
 *
 * @returns             An array of language extensions.
 */
export const vsCodeLangExts = (vsCodeLangs: string | string[]): string[] => {
	let exts: string[] = []; // Initialize.
	vsCodeLangs = $toꓺcastArray(vsCodeLangs);

	for (const [, group] of Object.entries($mimeꓺtypes)) {
		for (const [subgroupExts, subgroup] of Object.entries(group)) {
			if (vsCodeLangs.includes(subgroup.vsCodeLang)) {
				exts = exts.concat(subgroupExts.split('|'));
			}
		}
	}
	return [...new Set(exts.sort())]; // Unique extensions.
};

/**
 * Gets all MIME-type extensions by VS Code lang ID.
 *
 * @returns An array of extensions by VS Code lang ID.
 */
export const extsByVSCodeLang = (): { [x: string]: string[] } => {
	let exts: { [x: string]: string[] } = {}; // Initialize.

	for (const [, group] of Object.entries($mimeꓺtypes)) {
		for (const [subgroupExts, subgroup] of Object.entries(group)) {
			exts[subgroup.vsCodeLang] = exts[subgroup.vsCodeLang] || [];
			exts[subgroup.vsCodeLang] = exts[subgroup.vsCodeLang].concat(subgroupExts.split('|'));
		}
	}
	for (const [vsCodeLang] of Object.entries(exts)) {
		exts[vsCodeLang] = [...new Set(exts[vsCodeLang].sort())];
	}
	return exts; // Unique extensions within each VS Code lang ID group.
};

/**
 * Default git ignores, by group.
 */
export const defaultGitIgnoresByGroup: DefaultGitIgnoresByGroup = {
	'Locals': [
		'._*', //
		'.~*',
		'.#*',
	],
	'Envs': [
		'.envs',
		'*.env', //
	],
	'Logs': [
		'*.log', //
		'*.logs',
	],
	'Backups': [
		'*~', //
		'*.bak',
	],
	'Patches': [
		'*.rej', //
		'*.orig',
		'*.patch',
		'*.diff',
	],
	'Editors': {
		'VS Code': [
			'*.code-*', //
			// '*.code-search',
			// '*.code-workspace',
		],
		'IntelliJ': [
			'.idea', //
		],
		'Vim': [
			'.*.swp', //
		],
		'CTAGs': [
			'*.ctags', //
		],
	},
	'Tooling': {
		'Dotenv': [
			'.env.me', //
		],
		'TypeScript': [
			'.tscache', //
			'*.tsbuildinfo',
		],
		'Vite': [
			'.vite', //
			'.vitest',
		],
		'Wrangler': [
			'.wrangler', //
			'.dev.vars',
			'.dev.vars.*',
		],
		'Rollup': [
			'.rollup', //
		],
		'Webpack': [
			'.webpack', //
		],
		'Linaria': [
			'.linaria-cache', //
		],
		'SASS': [
			'.sass-cache', //
		],
		'Docker': [
			'.docker', //
		],
		'Vagrant': [
			'.vagrant', //
		],
		'Elastic Beanstalk': [
			'.elasticbeanstalk', //
		],
	},
	'Packages': {
		'Yarn': [
			'.yarn', //
		],
		'Vendor': [
			'vendor', //
		],
		'NodeJS': [
			'node_modules', //
		],
		'JSPM': [
			'jspm_packages', //
		],
		'Bower': [
			'bower_components', //
		],
	},
	'Version Control': {
		'Git': [
			'.git', //
		],
		'Subversion': [
			'.svn', //
			'_svn',
			'.svnignore',
		],
		'Bazaar': [
			'.bzr', //
			'.bzrignore',
		],
		'Mercurial': [
			'.hg', //
			'.hgignore',
		],
	},
	'Operating Systems': {
		'Windows Files': [
			'Thumbs.db', //
			'ehthumbs.db',
			'Desktop.ini',
		],
		'Windows Dirs': [
			'$RECYCLE.BIN', //
		],
		'MacOS Files': [
			// '._*', Already listed above.
			'Icon\r',
			'*.icloud',
			'.DS_Store',
			'.disk_label',
			'.LSOverride',
			'.VolumeIcon.icns',
			'.com.apple.timemachine.*',
		],
		'MacOS Dirs': [
			'.apdisk', //
			'*.icloud',
			'.fseventsd',
			'.AppleDB',
			'.AppleDesktop',
			'.AppleDouble',
			'.Trashes',
			'.TemporaryItems',
			'.Spotlight-V100',
			'.DocumentRevisions-V100',
			'Network Trash Folder',
			'Temporary Items',
		],
	},
	'Dist': [
		'dist', //
	],
};

/**
 * Default NPM ignores, by group.
 *
 * `npm:` prefix necessary to preserve groups from `./.gitignore`. Important we preserve not just the groups, but also
 * the insertion order so these can be extracted as a flat array of rules. Don’t remove the `npm:` prefix.
 */
export const defaultNPMIgnoresByGroup: DefaultNPMIgnoresByGroup = {
	...defaultGitIgnoresByGroup,

	'npm:Dist': [
		'!dist', //
	],
	'npm:Dots': [
		'.*', //
	],
	'npm:Configs': [
		'tsconfig.*', //
		'wrangler.*',
		'*.config.*',
		'config.gypi',
	],
	'npm:Locks': [
		'yarn.lock', //
		'composer.lock',
		'package-lock.json',
	],
	'npm:Src': [
		'src', //
	],
	'npm:Dev': [
		'dev', //
	],
	'npm:Sandbox': [
		'sandbox', //
	],
	'npm:Examples': [
		'example', //
		'examples',
	],
	'npm:Docs': [
		'doc', //
		'docs',
		'*.doc.*',
		'*.docs.*',
		'readme.*',
		'*.readme.*',
	],
	'npm:Tests': [
		'test', //
		'tests',
		'*.test.*',
		'*.tests.*',
		'*.test-d.*',
		'*.tests-d.*',
	],
	'npm:Specs': [
		'spec', //
		'specs',
		'*.spec.*',
		'*.specs.*',
		'*.spec-d.*',
		'*.specs-d.*',
	],
	'npm:Benchmarks': [
		'bench', //
		'benchmark',
		'benchmarks',
		'*.bench.*',
		'*.benchmark.*',
		'*.benchmarks.*',
	],
	// There are also a few items always included and/or excluded by NPM.
	// See: <https://docs.npmjs.com/cli/v9/configuring-npm/package-json#files>
	// See: <https://docs.npmjs.com/cli/v8/using-npm/developers?v=true#keeping-files-out-of-your-package>
	// Other than `package.json`, `README`, `LICENSE|LICENCE`, our rules already cover everything that NPM does.
};

/**
 * Default git/NPM ignores by category; for special-use cases.
 *
 * E.g., We use these breakdowns when configuring various devops tools.
 */
export const defaultGitNPMIgnoresByCategory = {
	// Locals

	localIgnores: [
		'._*', //
		'.~*',
		'.#*',
	],
	// Envs

	envIgnores: [
		'.envs',
		'*.env', //
	],
	// Logs

	logIgnores: [
		'*.log', //
		'*.logs',
	],
	// Backups

	backupIgnores: [
		'*~', //
		'*.bak',
	],
	// Patches

	patchIgnores: [
		'*.rej', //
		'*.orig',
		'*.patch',
		'*.diff',
	],
	// Editors

	editorIgnores: [
		// VS Code

		'*.code-*',
		// '*.code-search',
		// '*.code-workspace',

		// IntelliJ

		'.idea',

		// Vim

		'.*.swp',

		// CTAGs

		'*.ctags',
	],
	// Tooling

	toolingIgnores: [
		// Dotenv

		'.env.me',

		// TypeScript

		'.tscache',
		'*.tsbuildinfo',

		// Vite

		'.vite',
		'.vitest',

		// Wrangler

		'.wrangler',
		'.dev.vars',
		'.dev.vars.*',

		// Rollup

		'.rollup',

		// Webpack

		'.webpack',

		// Linaria

		'.linaria-cache',

		// SASS

		'.sass-cache',

		// Docker

		'.docker',

		// Vagrant

		'.vagrant',

		// Elastic Beanstalk

		'.elasticbeanstalk',
	],
	// Packages

	pkgIgnores: [
		// Yarn

		'.yarn',

		// Vendor

		'vendor',

		// NodeJS

		'node_modules',

		// JSPM

		'jspm_packages',

		// Bower

		'bower_components',
	],
	// Version Control

	vcsIgnores: [
		// Git

		'.git',

		// Subversion

		'.svn',
		'_svn',
		'.svnignore',

		// Bazaar

		'.bzr',
		'.bzrignore',

		// Mercurial

		'.hg',
		'.hgignore',
	],
	// Operating Systems

	osIgnores: [
		// Windows Files

		'Thumbs.db',
		'ehthumbs.db',
		'Desktop.ini',

		// Windows Dirs

		'$RECYCLE.BIN',

		// MacOS Files

		'._*',
		'Icon\r',
		'*.icloud',
		'.DS_Store',
		'.disk_label',
		'.LSOverride',
		'.VolumeIcon.icns',
		'.com.apple.timemachine.*',

		// MacOS Dirs

		'.apdisk',
		'*.icloud',
		'.fseventsd',
		'.AppleDB',
		'.AppleDesktop',
		'.AppleDouble',
		'.Trashes',
		'.TemporaryItems',
		'.Spotlight-V100',
		'.DocumentRevisions-V100',
		'Network Trash Folder',
		'Temporary Items',
	],
	// Dots

	dotIgnores: [
		'.*', //
		// This category covers everything else we have in `./.npmignore`
		// that isn’t already grouped in some other way by our exclusions.

		// Note that `[name].tsbuildinfo` can also appear as `.tsbuildinfo`.
		// So it’s technically a `.` file, or should be. We treat it as such.
		'*.tsbuildinfo', // Tracks progressive project builds (local only).
	],
	// Types

	dtsIgnores: [
		'*.d.ts', //
		'*.d.tsx',
		'*.d.cts',
		'*.d.ctsx',
		'*.d.mts',
		'*.d.mtsx',
	],
	// Configs

	configIgnores: [
		'tsconfig.*', //
		'wrangler.*',
		'*.config.*',
		'config.gypi',
		'package.json',
	],
	// Locks

	lockIgnores: [
		'yarn.lock', //
		'composer.lock',
		'package-lock.json',
	],
	// Dev

	devIgnores: [
		'dev', //
	],
	// Dist

	distIgnores: [
		'dist', //
	],
	// Sandbox

	sandboxIgnores: [
		'sandbox', //
	],
	// Examples

	exampleIgnores: [
		'example', //
		'examples',
	],
	// Docs

	docIgnores: [
		'doc', //
		'docs',
		'*.doc.*',
		'*.docs.*',
		'readme.*',
		'*.readme.*',
	],
	// Tests

	testIgnores: [
		'test', //
		'tests',
		'*.test.*',
		'*.tests.*',
		'*.test-d.*',
		'*.tests-d.*',
	],
	// Specs

	specIgnores: [
		'spec', //
		'specs',
		'*.spec.*',
		'*.specs.*',
		'*.spec-d.*',
		'*.specs-d.*',
	],
	// Benchmarks

	benchIgnores: [
		'bench', //
		'benchmark',
		'benchmarks',
		'*.bench.*',
		'*.benchmark.*',
		'*.benchmarks.*',
	],
};

/**
 * Default git ignores (as a flat array).
 */
let _defaultGitIgnores: string[] = []; // Initialize.
for (const [, group] of Object.entries(defaultGitIgnoresByGroup)) {
	if (!Array.isArray(group)) {
		for (const [, subgroup] of Object.entries(group)) {
			_defaultGitIgnores = _defaultGitIgnores.concat(subgroup);
		}
	} else {
		_defaultGitIgnores = _defaultGitIgnores.concat(group);
	}
} // We export unique ignores only.
export const defaultGitIgnores = [...new Set(_defaultGitIgnores)];

/**
 * Default NPM ignores (as a flat array).
 */
let _defaultNPMIgnores: string[] = []; // Initialize.
for (const [, group] of Object.entries(defaultNPMIgnoresByGroup)) {
	if (!Array.isArray(group)) {
		for (const [, subgroup] of Object.entries(group)) {
			_defaultNPMIgnores = _defaultNPMIgnores.concat(subgroup);
		}
	} else {
		_defaultNPMIgnores = _defaultNPMIgnores.concat(group);
	}
} // We export unique ignores only.
export const defaultNPMIgnores: string[] = [...new Set(_defaultNPMIgnores)];
