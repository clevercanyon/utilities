/**
 * Path utilities.
 */

import type { Ignore as GitIgnore } from 'ignore';
import { default as untypedGitIgnoreFactory } from 'ignore';
import { defaults as $objꓺdefaults } from './obj.ts';
import { escRegExp as $strꓺescRegExp } from './str.ts';

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
export type GlobToRegExpOptions = {
	ignoreCase?: boolean;
};

/**
 * Checks if path has an extension.
 *
 * @param   path Path to consider.
 *
 * @returns      True if path has an extension.
 */
export const hasExt = (path: string): boolean => {
	const cleanPath = path.split(/[?#]/u)[0];
	return '' !== cleanPath && extRegExp.test(cleanPath);
};

/**
 * Checks if path has a static extension.
 *
 * @param   path Path to consider.
 *
 * @returns      True if path has a static extension.
 */
export const hasStaticExt = (path: string): boolean => {
	const cleanPath = path.split(/[?#]/u)[0];
	return '' !== cleanPath && extRegExp.test(cleanPath) && staticExtRegExp.test(cleanPath);
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
 * Converts a glob into a regular expression.
 *
 * @param   glob    Glob to convert into a regular expression.
 * @param   options Options (all optional); {@see GlobToRegExpOptions}.
 *
 * @returns         Glob as a regular expression.
 */
export const globToRegExp = (glob: string, options?: GlobToRegExpOptions): RegExp => {
	const opts = $objꓺdefaults({}, options || {}, { ignoreCase: false }) as Required<GlobToRegExpOptions>;
	return new RegExp(globToRegExpString(glob), opts.ignoreCase ? 'ui' : 'u');
};

/**
 * Converts a glob into a regular expression string.
 *
 * @param   glob Glob to convert into a regular expression string.
 *
 * @returns      Glob as a regular expression string.
 */
export const globToRegExpString = (glob: string): string => {
	return (
		'^' +
		$strꓺescRegExp(glob)
			.replace(/\\\*\\\*/gu, '[\\s\\S]*')
			.replace(/\\\*/gu, '[^\\/]*') +
		'$'
	);
};

/**
 * Default git ignores.
 */
export const defaultGitIgnores: string[] = [
	// Locals

	'._*',
	'.~*',
	'.#*',
	'*.local',

	// Logs

	'*.log',
	'*.logs',

	// Backups

	'*~',
	'*.bak',

	// Patches

	'*.rej',
	'*.orig',
	'*.patch',
	'*.diff',

	// Editors

	// :: Vim

	'.*.swp',

	// :: IntelliJ

	'.idea',

	// :: Sublime

	'*.sublime-project',
	'*.sublime-workspace',

	// :: Netbeans

	'*.nbproject',

	// :: VS Code

	'*.code-search',
	'*.code-workspace',

	// :: CTAGs

	'*.ctags',

	// Dist

	'dist',

	// Packages

	// :: Yarn

	'.yarn',

	// :: Vendor

	'vendor',

	// :: NodeJS

	'node_modules',

	// :: JSPM

	'jspm_packages',

	// :: Bower

	'bower_components',

	// Dotenv

	'.env*',
	'.flaskenv*',

	'!.env.vault',
	'!.env.project',

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

	// Version Control

	// :: Git

	'.git',

	// :: Subversion

	'.svn',
	'_svn',
	'.svnignore',

	// :: Bazaar

	'.bzr',
	'.bzrignore',

	// :: Mercurial

	'.hg',
	'.hgignore',

	// Operating Systems

	// :: Windows Files

	'Thumbs.db',
	'ehthumbs.db',
	'Desktop.ini',

	// :: Windows Directories

	'$RECYCLE.BIN',

	// :: MacOS Files

	// '._*', Already listed above.
	'Icon\r',
	'*.icloud',
	'.DS_Store',
	'.disk_label',
	'.LSOverride',
	'.VolumeIcon.icns',
	'.com.apple.timemachine.*',

	// :: MacOS Directories

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
];

/**
 * Default NPM ignores.
 */
export const defaultNPMIgnores: string[] = defaultGitIgnores.concat([
	// Dist

	'!dist',

	// Configs

	'tsconfig.*',
	'wrangler.*',
	'*.config.*',
	'config.gypi',

	// Locks

	'yarn.lock',
	'composer.lock',
	'package-lock.json',

	// Dots

	'.*',

	// Src

	'src',

	// Dev

	'dev',

	// Sandbox

	'sandbox',

	// Examples

	'example',
	'examples',

	// Docs

	'doc',
	'docs',
	'*.doc.*',
	'*.docs.*',
	'readme.*',
	'*.readme.*',

	// Tests

	'test',
	'tests',
	'*.test.*',
	'*.tests.*',
	'*.test-d.*',
	'*.tests-d.*',

	// Specs

	'spec',
	'specs',
	'*.spec.*',
	'*.specs.*',
	'*.spec-d.*',
	'*.specs-d.*',

	// Benchmarks

	'bench',
	'benchmark',
	'benchmarks',
	'*.bench.*',
	'*.benchmark.*',
	'*.benchmarks.*',

	// There are also a few items always included and/or excluded by NPM.
	// See: <https://docs.npmjs.com/cli/v9/configuring-npm/package-json#files>
	// See: <https://docs.npmjs.com/cli/v8/using-npm/developers?v=true#keeping-files-out-of-your-package>
	// Other than `package.json`, `README`, `LICENSE|LICENCE`, our rules already cover everything that NPM does.
]);

/**
 * Default git/NPM ignores by category; for special use cases.
 */
export const defaultGitNPMIgnoresByCategory = {
	// Locals

	localIgnores: [
		'._*', //
		'.~*',
		'.#*',
		'*.local',
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
		// Vim

		'.*.swp',

		// IntelliJ

		'.idea',

		// Sublime

		'*.sublime-project',
		'*.sublime-workspace',

		// Netbeans

		'*.nbproject',

		// VS Code

		'*.code-search',
		'*.code-workspace',

		// CTAGs

		'*.ctags',
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

		// Windows Directories

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

		// MacOS Directories

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

		// Note that `.tsbuildinfo` can also appear as `[name].tsbuildinfo`.
		// So it’s technically a `.` file, or should be. We treat it as such.
		'*.tsbuildinfo',
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
 * Static extensions.
 */
export const staticExts: string[] = [
	'3g2',
	'3gp',
	'3gp2',
	'3gpp',
	'7z',
	'aac',
	'ai',
	'apng',
	'app',
	'asc',
	'asf',
	'asx',
	'atom',
	'avi',
	'bash',
	'bat',
	'bin',
	'blend',
	'bmp',
	'c',
	'cc',
	'cfg',
	'cjs',
	'class',
	'com',
	'conf',
	'css',
	'csv',
	'cts',
	'dfxp',
	'divx',
	'dll',
	'dmg',
	'doc',
	'docm',
	'docx',
	'dotm',
	'dotx',
	'dtd',
	'ejs',
	'eot',
	'eps',
	'ets',
	'exe',
	'fla',
	'flac',
	'flv',
	'gif',
	'gtar',
	'gz',
	'gzip',
	'h',
	'heic',
	'hta',
	'htaccess',
	'htc',
	'htm',
	'html',
	'htpasswd',
	'ico',
	'ics',
	'ini',
	'iso',
	'jar',
	'jpe',
	'jpeg',
	'jpg',
	'js',
	'json',
	'json5',
	'jsonld',
	'jsx',
	'key',
	'kml',
	'kmz',
	'log',
	'm4a',
	'm4b',
	'm4v',
	'md',
	'mdb',
	'mid',
	'midi',
	'mjs',
	'mka',
	'mkv',
	'mo',
	'mov',
	'mp3',
	'mp4',
	'mpe',
	'mpeg',
	'mpg',
	'mpp',
	'mts',
	'numbers',
	'odb',
	'odc',
	'odf',
	'odg',
	'odp',
	'ods',
	'odt',
	'oga',
	'ogg',
	'ogv',
	'onepkg',
	'onetmp',
	'onetoc',
	'onetoc2',
	'otf',
	'oxps',
	'pages',
	'pdf',
	'phar',
	'phps',
	'pict',
	'pls',
	'png',
	'po',
	'pot',
	'potm',
	'potx',
	'ppam',
	'pps',
	'ppsm',
	'ppsx',
	'ppt',
	'pptm',
	'pptx',
	'ps',
	'psd',
	'pspimage',
	'qt',
	'ra',
	'ram',
	'rar',
	'rdf',
	'rss',
	'rss-http',
	'rss2',
	'rtf',
	'rtx',
	'scss',
	'sh',
	'sketch',
	'sldm',
	'sldx',
	'so',
	'sql',
	'sqlite',
	'srt',
	'svg',
	'svgz',
	'swf',
	'tar',
	'tgz',
	'tif',
	'tiff',
	'tmpl',
	'toml',
	'tpl',
	'ts',
	'tsv',
	'tsx',
	'ttf',
	'txt',
	'vtt',
	'wav',
	'wax',
	'webm',
	'webp',
	'wm',
	'wma',
	'wmv',
	'wmx',
	'woff',
	'woff2',
	'wp',
	'wpd',
	'wri',
	'xcf',
	'xhtm',
	'xhtml',
	'xla',
	'xlam',
	'xls',
	'xlsb',
	'xlsm',
	'xlsx',
	'xlt',
	'xltm',
	'xltx',
	'xlw',
	'xml',
	'xps',
	'xsd',
	'xsl',
	'xslt',
	'yaml',
	'yml',
	'zip',
	'zsh',
];

/**
 * Any extension RegExp.
 */
export const extRegExp = new RegExp('[^/.]\\.([^/.]+)$', 'u');

/**
 * Static extensions piped for use in RegExp.
 */
export const staticExtsPipedForRegExp = staticExts.join('|');

/**
 * Static extension RegExp.
 */
export const staticExtRegExp = new RegExp('[^/.]\\.(' + staticExtsPipedForRegExp + ')$', 'iu');
