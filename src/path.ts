/**
 * Path utilities.
 */

import type { Ignore as GitIgnore } from 'ignore';
import { defaults as $objꓺdefaults } from './obj.js';
import { default as untypedGitIgnoreFactory } from 'ignore';

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
 * Default git ignores.
 */
export const defaultGitIgnores: string[] = [
	// Locals.

	'.#*',
	'.~*',
	'*.local',

	// Logs.

	'*.log',
	'*.logs',

	// Backups.

	'*~',
	'*.bak',

	// Patches.

	'*.rej',
	'*.orig',
	'*.patch',
	'*.diff',

	// IntelliJ.

	'.idea',

	// Sublime.

	'*.sublime-project',
	'*.sublime-workspace',

	// Netbeans.

	'*.nbproject',

	// VS Code.

	'.vscode',
	'*.code-search',
	'*.code-workspace',

	// Dists (must exclude).
	// May contain APP_ env vars.

	'dist',

	// Yarn.

	'.yarn',

	// Vendor.

	'vendor',

	// NodeJS.

	'node_modules',

	// JSPM.

	'jspm_packages',

	// Bower.

	'bower_components',

	// Dotenv.

	'.env*',
	'.flaskenv*',

	'!.env.vault',
	'!.env.project',

	// TypeScript.

	'typings',
	'.tscache',
	'*.tsbuildinfo',

	// Vite.

	'.vite',
	'.vitest',

	// Wrangler.

	'.wrangler',
	'.dev.vars',
	'.dev.vars.*',

	// Rollup.

	'.rollup',

	// Webpack.

	'.webpack',

	// Linaria.

	'.linaria-cache',

	// SASS.

	'.sass-cache',

	// Docker.

	'.docker',

	// Vagrant.

	'.vagrant',

	// Elastic Beanstalk.

	'.elasticbeanstalk',

	// CTAGs.

	'*.ctags',
	'*.tags',

	// VCS.

	'.git',

	'.svn',
	'_svn',
	'.svnignore',

	'CVS',
	'.cvsignore',

	'.bzr',
	'.bzrignore',

	'.hg',
	'.hgignore',

	'SCCS',
	'RCS',

	// PC files.

	'Thumbs.db',
	'ehthumbs.db',
	'Desktop.ini',

	// PC directories.

	'$RECYCLE.BIN',

	// Mac files.

	'._*',
	'Icon?',
	'!Icons',
	'*.icloud',
	'.DS_Store',
	'.disk_label',
	'.LSOverride',
	'.VolumeIcon.icns',
	'.com.apple.timemachine.*',

	// Mac directories.

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
	// Dist (allow).

	'!dist',

	// Configs.

	'.*',

	'*config.*',
	'!dist/**/*config.*',

	'*.config.*',
	'!dist/**/*.config.*',

	'wrangler.*',
	'!dist/**/wrangler.*',

	// Uncompiled sources.

	'*.scss',
	'!dist/**/*.scss',

	'*.less',
	'!dist/**/*.less',

	'*.ejs',
	'!dist/**/*.ejs',

	'*.jsx',
	'!dist/**/*.jsx',

	'*.ts',
	'!*.d.ts',
	'!dist/**/*.ts',

	'*.tsx',
	'!*.d.tsx',
	'!dist/**/*.tsx',

	'*.cts',
	'!*.d.cts',
	'!dist/**/*.cts',

	'*.ctsx',
	'!*.d.ctsx',
	'!dist/**/*.ctsx',

	'*.mts',
	'!*.d.mts',
	'!dist/**/*.mts',

	'*.mtsx',
	'!*.d.mtsx',
	'!dist/**/*.mtsx',

	// Dev.

	'dev',
	'__dev__',

	// Docs.

	'doc',
	'docs',
	'__doc__',
	'__docs__',
	'*.doc.*',
	'*.docs.*',
	'*.readme.*',
	'*.readmes.*',

	// Tests.

	'test',
	'tests',
	'__test__',
	'__tests__',
	'*.test.*',
	'*.tests.*',
	'*.test-d.*',
	'*.tests-d.*',

	// Specs.

	'spec',
	'specs',
	'__spec__',
	'__specs__',
	'*.spec.*',
	'*.specs.*',
	'*.spec-d.*',
	'*.specs-d.*',

	// Examples.

	'example',
	'examples',
	'__example__',
	'__examples__',
	'*.example.*',
	'*.examples.*',

	// Benchmarks.

	'bench',
	'benchmark',
	'benchmarks',
	'__bench__',
	'__benchmark__',
	'__benchmarks__',
	'*.bench.*',
	'*.benchmark.*',
	'*.benchmarks.*',
]);

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
