/**
 * MIME utilities.
 */

import { ext as $pathꓺext } from './path.ts';

const binary = 'code-text-binary';
const stream = 'application/octet-stream';

/**
 * Defines types.
 */
export type Types = {
	[x: string]: {
		[x: string]: {
			type: string;
			isTextual: boolean;
			vscodeLang: string;
		};
	};
};

/**
 * Gets a file's MIME type.
 *
 * @param   file        Absolute or relative file path.
 * @param   defaultType Default MIME type if unable to determine. Default is: `application/octet-stream`.
 *
 * @returns             MIME type; e.g., `text/html`, `image/svg+xml`, etc.
 */
export const fileType = (file: string, defaultType?: string): string => {
	const fileExt = $pathꓺext(file); // File extension.
	defaultType = defaultType || stream;

	if (!fileExt) return defaultType; // Not possible.

	for (const [, group] of Object.entries(types)) {
		for (const [subgroupExts, subgroup] of Object.entries(group)) {
			if (subgroupExts.split('|').includes(fileExt)) return subgroup.type;
		}
	}
	return defaultType; // Not possible.
};

/**
 * Gets a file's MIME type + charset, suitable for `content-type:` header.
 *
 * @param   file        Absolute or relative file path.
 * @param   defaultType Default MIME type if unable to determine. {@see fileType()} for default value.
 * @param   charset     Optional charset code to use. To explicitly force no charset, set this to an empty string.
 *   Otherwise, if not given explicitly, {@see contentTypeCharset()} determines charset value; e.g., `utf-8`.
 *
 * @returns             MIME content type + a possible charset. Suitable for `content-type:` header.
 */
export const contentType = (file: string, defaultType?: string, charset?: string): string => {
	let fileContentType = fileType(file, defaultType);

	if (undefined !== charset) {
		if ('' !== charset /* Empty indicates no charset explicitly. */) {
			fileContentType += '; charset=' + charset;
		}
	} else if ((charset = contentTypeCharset(fileContentType))) {
		fileContentType += '; charset=' + charset;
	}
	return fileContentType;
};

/**
 * Gets charset for a given MIME content type.
 *
 * @param   contentType MIME content type.
 *
 * @returns             Charset for MIME content type; else empty string.
 */
export const contentTypeCharset = (contentType: string): string => {
	if (!contentType) return ''; // Not applicable.

	switch (true) {
		case contentType.startsWith('text/'):
		case contentType.endsWith('+json'):
		case contentType.endsWith('+xml'):
		case 'application/json' === contentType:
		case 'application/javascript' === contentType:
		case 'application/typescript' === contentType:
		case 'application/x-php-source' === contentType:
		case 'application/php-archive' === contentType:
		case 'application/xml-dtd' === contentType:
		case 'application/hta' === contentType:
			return 'utf-8';
	}
	return ''; // Not applicable.
};

/**
 * Defines MIME types.
 */
export const types: Types = {
	// Documents.

	'Text': {
		'txt': { type: 'text/plain', isTextual: true, vscodeLang: 'plaintext' },
	},
	'Markdown': {
		'md': { type: 'text/markdown', isTextual: true, vscodeLang: 'markdown' },
		'mdx': { type: 'text/markdown', isTextual: true, vscodeLang: 'mdx' },
	},
	'Rich Text': {
		'rtf': { type: 'application/rtf', isTextual: false, vscodeLang: binary },
		'rtx': { type: 'text/richtext', isTextual: false, vscodeLang: binary },
	},
	'HTML': {
		// If this changes, also update extensions lib in `clevercanyon/skeleton` dotfiles.
		'htm|html': { type: 'text/html', isTextual: true, vscodeLang: 'html' },
		'shtm|shtml': { type: 'text/html', isTextual: true, vscodeLang: 'html' },
	},
	'PDF': {
		'pdf': { type: 'application/pdf', isTextual: false, vscodeLang: binary },
	},
	'Other Text': {
		'vtt': { type: 'text/vtt', isTextual: true, vscodeLang: 'plaintext' },
		'asc|c|cc|h|srt': { type: 'text/plain', isTextual: true, vscodeLang: 'plaintext' },
	},
	// Backend code w/ dynamic exclusons.
	// {@see $path.staticExts} for dynamic exclusons.

	'PHP': {
		'php|phtm|phtml': { type: 'text/html', isTextual: true, vscodeLang: 'php' },
	},
	'Ruby': {
		'rb': { type: 'text/html', isTextual: true, vscodeLang: 'ruby' },
	},
	'Python': {
		'py': { type: 'text/html', isTextual: true, vscodeLang: 'python' },
	},
	'ASP': {
		'asp|aspx': { type: 'text/html', isTextual: true, vscodeLang: 'plaintext' },
	},
	'Perl': {
		'pl6|perl6': { type: 'text/html', isTextual: true, vscodeLang: 'perl6' },
		'cgi|pl|plx|ppl|perl': { type: 'text/html', isTextual: true, vscodeLang: 'perl' },
	},
	'Shell': {
		'sh|zsh|bash': { type: 'text/html', isTextual: true, vscodeLang: 'shellscript' },
	},
	// Other backend code formats.
	// Not part of our dynamic exclusions.

	'Node Archive': {
		'node': { type: 'application/x-node-archive', isTextual: false, vscodeLang: binary },
	},
	'PHP Archive': {
		'phar': { type: 'application/x-php-archive', isTextual: false, vscodeLang: binary },
	},
	'PHP Source': {
		'phps': { type: 'application/x-php-source', isTextual: true, vscodeLang: 'php' },
	},
	'Docker': {
		'dockerfile': { type: stream, isTextual: true, vscodeLang: 'dockerfile' },
	},
	'JS Automation': {
		'jxa': { type: 'application/javascript', isTextual: true, vscodeLang: 'jxa' },
	},
	'AppleScript': {
		'applescript': { type: 'application/applescript', isTextual: true, vscodeLang: 'applescript' },
		'scpt|scptd': { type: 'application/applescript', isTextual: false, vscodeLang: 'applescript.binary' },
	},
	'Batch': {
		'bat': { type: 'text/html', isTextual: true, vscodeLang: 'bat' }, // Windows batch file.
	},
	// Frontend code (most of the time).

	'JavaScript': {
		// If this changes, also update extensions lib in `clevercanyon/skeleton` dotfiles.
		'wasm': { type: 'application/wasm', isTextual: false, vscodeLang: binary },
		'js|cjs|mjs': { type: 'application/javascript', isTextual: true, vscodeLang: 'javascript' },
		'jsx|cjsx|mjsx': { type: 'application/javascript', isTextual: true, vscodeLang: 'javascriptreact' },
	},
	'TypeScript': {
		// If this changes, also update extensions lib in `clevercanyon/skeleton` dotfiles.
		'ts|cts|mts': { type: 'application/typescript', isTextual: true, vscodeLang: 'typescript' },
		'tsx|ctsx|mtsx': { type: 'application/typescript', isTextual: true, vscodeLang: 'typescriptreact' },
	},
	'Style': {
		'css': { type: 'text/css', isTextual: true, vscodeLang: 'css' },
		'scss': { type: 'text/css', isTextual: true, vscodeLang: 'scss' },
		'less': { type: 'text/css', isTextual: true, vscodeLang: 'less' },
		'xsd': { type: 'application/xsd+xml', isTextual: true, vscodeLang: 'xml' },
		'xsl|xslt': { type: 'application/xslt+xml', isTextual: true, vscodeLang: 'xml' },
	},
	// Other code.

	'Other Code': {
		'hta': { type: 'application/hta', isTextual: true, vscodeLang: 'plaintext' },
		'htc': { type: 'text/x-component', isTextual: true, vscodeLang: 'plaintext' },
		'class': { type: 'application/java', isTextual: false, vscodeLang: binary },
	},
	// Templates.

	'EJS': {
		'ejs': { type: 'text/plain', isTextual: true, vscodeLang: 'html' },
	},
	'Liquid': {
		'liq|liquid': { type: 'text/plain', isTextual: true, vscodeLang: 'liquid' },
	},
	'Other Template': {
		'tpl|tmpl': { type: 'text/plain', isTextual: true, vscodeLang: 'plaintext' },
	},
	// Data|config files.

	'SQL': {
		'sql|sqlite': { type: 'text/plain', isTextual: true, vscodeLang: 'sql' },
	},
	'Delimited': {
		'csv': { type: 'text/csv', isTextual: true, vscodeLang: 'plaintext' },
		'tsv': { type: 'text/tab-separated-values', isTextual: true, vscodeLang: 'plaintext' },
	},
	'JSON': {
		'json': { type: 'application/json', isTextual: true, vscodeLang: 'json' },
		'json5': { type: 'application/json5', isTextual: true, vscodeLang: 'jsonc' },
		'jsonld': { type: 'application/ld+json', isTextual: true, vscodeLang: 'json' },
	},
	'TOML': {
		'toml': { type: 'text/plain', isTextual: true, vscodeLang: 'toml' },
	},
	'YAML': {
		'yaml|yml': { type: 'text/plain', isTextual: true, vscodeLang: 'yaml' },
	},
	'INI': {
		'ini': { type: 'text/plain', isTextual: true, vscodeLang: 'ini' },
	},
	'Properties': {
		'env|env.*': { type: 'text/plain', isTextual: true, vscodeLang: 'properties' },
		'properties|props': { type: 'text/plain', isTextual: true, vscodeLang: 'properties' },
		'exacolors': { type: 'text/plain', isTextual: true, vscodeLang: 'properties' },
	},
	'Apache': {
		'conf': { type: 'text/plain', isTextual: true, vscodeLang: 'apacheconf' },
		'htaccess|htpasswd': { type: 'text/plain', isTextual: true, vscodeLang: 'apacheconf' },
	},
	'I18n': {
		'po': { type: 'text/x-gettext-translation', isTextual: true, vscodeLang: 'plaintext' }, // `pot` taken; use `po`.
		'mo': { type: 'application/x-gettext-translation', isTextual: false, vscodeLang: binary },
	},
	'XML': {
		'dtd': { type: 'application/xml-dtd', isTextual: true, vscodeLang: 'xml' },
		'xhtm|xhtml': { type: 'application/xhtml+xml', isTextual: true, vscodeLang: 'xml' },
		'xml': { type: 'text/xml', isTextual: true, vscodeLang: 'xml' },
	},
	'Calendar': {
		'ics': { type: 'text/calendar', isTextual: true, vscodeLang: 'plaintext' },
	},
	'Feed': {
		'atom': { type: 'application/atom+xml', isTextual: true, vscodeLang: 'xml' },
		'rdf': { type: 'application/rdf+xml', isTextual: true, vscodeLang: 'xml' },
		'rss-http': { type: 'text/xml', isTextual: true, vscodeLang: 'xml' },
		'rss|rss2': { type: 'application/rss+xml', isTextual: true, vscodeLang: 'xml' },
	},
	'Log': {
		'log': { type: 'text/plain', isTextual: true, vscodeLang: 'plaintext' },
	},
	'Other Data': {
		'hex': { type: stream, isTextual: false, vscodeLang: 'hexEditor.hexedit' },
	},
	'Other Config': {
		'babelrc': { type: 'text/plain', isTextual: true, vscodeLang: 'jsonc' },
		'npmrc': { type: 'text/plain', isTextual: true, vscodeLang: 'properties' },
		'yarnrc': { type: 'text/plain', isTextual: true, vscodeLang: 'plaintext' },
		'inputrc': { type: 'text/plain', isTextual: true, vscodeLang: 'plaintext' },
		'tsbuildinfo': { type: 'text/plain', isTextual: true, vscodeLang: 'plaintext' },
		'editorconfig': { type: 'text/plain', isTextual: true, vscodeLang: 'editorconfig' },
		'shellcheckrc': { type: 'text/plain', isTextual: true, vscodeLang: 'shellcheckrc' },
		'browserslistrc': { type: 'text/plain', isTextual: true, vscodeLang: 'browserslist' },

		'gitchange': { type: 'text/plain', isTextual: true, vscodeLang: 'plaintext' },
		'gitconfig|gitattributes': { type: 'text/plain', isTextual: true, vscodeLang: 'properties' },

		'gitignore|npmignore|eslintignore|prettierignore': { type: 'text/plain', isTextual: true, vscodeLang: 'ignore' },
	},
	// Media formats.

	'Image': {
		'ai': { type: 'image/vnd.adobe.illustrator', isTextual: false, vscodeLang: binary },
		'apng': { type: 'image/apng', isTextual: false, vscodeLang: binary },
		'bmp': { type: 'image/bmp', isTextual: false, vscodeLang: binary },
		'eps': { type: 'image/eps', isTextual: false, vscodeLang: binary },
		'gif': { type: 'image/gif', isTextual: false, vscodeLang: binary },
		'heic': { type: 'image/heic', isTextual: false, vscodeLang: binary },
		'ico': { type: 'image/x-icon', isTextual: false, vscodeLang: binary },
		'jpg|jpeg|jpe': { type: 'image/jpeg', isTextual: false, vscodeLang: binary },
		'pict': { type: 'image/pict', isTextual: false, vscodeLang: binary },
		'png': { type: 'image/png', isTextual: false, vscodeLang: binary },
		'psd': { type: 'image/vnd.adobe.photoshop', isTextual: false, vscodeLang: binary },
		'pspimage': { type: 'image/vnd.corel.psp', isTextual: false, vscodeLang: binary },
		'svg': { type: 'image/svg+xml', isTextual: true, vscodeLang: 'xml' },
		'svgz': { type: 'image/svg+xml', isTextual: false, vscodeLang: binary },
		'tiff|tif': { type: 'image/tiff', isTextual: false, vscodeLang: binary },
		'webp': { type: 'image/webp', isTextual: false, vscodeLang: binary },
	},
	'Audio': {
		'aac': { type: 'audio/aac', isTextual: false, vscodeLang: binary },
		'flac': { type: 'audio/flac', isTextual: false, vscodeLang: binary },
		'mid|midi': { type: 'audio/midi', isTextual: false, vscodeLang: binary },
		'mka': { type: 'audio/x-matroska', isTextual: false, vscodeLang: binary },
		'mp3|m4a|m4b': { type: 'audio/mpeg', isTextual: false, vscodeLang: binary },
		'ogg|oga': { type: 'audio/ogg', isTextual: false, vscodeLang: binary },
		'pls': { type: 'audio/x-scpls', isTextual: false, vscodeLang: binary },
		'ra|ram': { type: 'audio/x-realaudio', isTextual: false, vscodeLang: binary },
		'wav': { type: 'audio/wav', isTextual: false, vscodeLang: binary },
		'wax': { type: 'audio/x-ms-wax', isTextual: false, vscodeLang: binary },
		'wma': { type: 'audio/x-ms-wma', isTextual: false, vscodeLang: binary },
	},
	'Video': {
		'3g2|3gp2': { type: 'video/3gpp2', isTextual: false, vscodeLang: binary },
		'3gp|3gpp': { type: 'video/3gpp', isTextual: false, vscodeLang: binary },
		'asf|asx': { type: 'video/x-ms-asf', isTextual: false, vscodeLang: binary },
		'avi': { type: 'video/avi', isTextual: false, vscodeLang: binary },
		'divx': { type: 'video/divx', isTextual: false, vscodeLang: binary },
		'flv': { type: 'video/x-flv', isTextual: false, vscodeLang: binary },
		'mkv': { type: 'video/x-matroska', isTextual: false, vscodeLang: binary },
		'mov|qt': { type: 'video/quicktime', isTextual: false, vscodeLang: binary },
		'mp4|m4v': { type: 'video/mp4', isTextual: false, vscodeLang: binary },
		'mpeg|mpg|mpe': { type: 'video/mpeg', isTextual: false, vscodeLang: binary },
		'ogv': { type: 'video/ogg', isTextual: false, vscodeLang: binary },
		'webm': { type: 'video/webm', isTextual: false, vscodeLang: binary },
		'wm': { type: 'video/x-ms-wm', isTextual: false, vscodeLang: binary },
		'wmv': { type: 'video/x-ms-wmv', isTextual: false, vscodeLang: binary },
		'wmx': { type: 'video/x-ms-wmx', isTextual: false, vscodeLang: binary },
	},
	'Font': {
		'otf': { type: 'application/x-font-otf', isTextual: false, vscodeLang: binary },
		'ttf': { type: 'application/x-font-ttf', isTextual: false, vscodeLang: binary },
		'woff|woff2': { type: 'application/x-font-woff', isTextual: false, vscodeLang: binary },
		'eot': { type: 'application/vnd.ms-fontobject', isTextual: false, vscodeLang: binary },
	},
	// Archives.

	'Archive': {
		'7z': { type: 'application/x-7z-compressed', isTextual: false, vscodeLang: binary },
		'dmg': { type: 'application/x-apple-diskimage', isTextual: false, vscodeLang: binary },
		'gtar': { type: 'application/x-gtar', isTextual: false, vscodeLang: binary },
		'gz|tgz|gzip': { type: 'application/x-gzip', isTextual: false, vscodeLang: binary },
		'iso': { type: 'application/iso-image', isTextual: false, vscodeLang: binary },
		'jar': { type: 'application/java-archive', isTextual: false, vscodeLang: binary },
		'rar': { type: 'application/rar', isTextual: false, vscodeLang: binary },
		'tar': { type: 'application/x-tar', isTextual: false, vscodeLang: binary },
		'zip|sketch': { type: 'application/zip', isTextual: false, vscodeLang: binary },
	},
	// Certificates.

	'Certificate': {
		'csr|crt|pem': { type: 'text/plain', isTextual: true, vscodeLang: 'plaintext' },
	},
	// Applications.

	'Other Application': {
		'app|xcf': { type: stream, isTextual: false, vscodeLang: binary },
		'bin': { type: stream, isTextual: false, vscodeLang: binary },
		'blend': { type: 'application/x-blender', isTextual: false, vscodeLang: binary },
		'com': { type: stream, isTextual: false, vscodeLang: binary },
		'dfxp': { type: 'application/ttaf+xml', isTextual: false, vscodeLang: binary },
		'dll': { type: stream, isTextual: false, vscodeLang: binary },
		'exe': { type: 'application/x-msdownload', isTextual: false, vscodeLang: binary },
		'so': { type: stream, isTextual: false, vscodeLang: binary },
	},
	// Proprietary.

	'Google': {
		'kml': { type: 'application/vnd.google-earth.kml+xml', isTextual: true, vscodeLang: 'xml' },
		'kmz': { type: 'application/vnd.google-earth.kmz', isTextual: false, vscodeLang: binary },
	},
	'Adobe': {
		'ps': { type: 'application/postscript', isTextual: false, vscodeLang: binary },
		'fla': { type: 'application/vnd.adobe.flash', isTextual: false, vscodeLang: binary },
		'swf': { type: 'application/x-shockwave-flash', isTextual: false, vscodeLang: binary },
	},
	'MS Office': {
		'doc': { type: 'application/msword', isTextual: false, vscodeLang: binary },
		'docm': { type: 'application/vnd.ms-word.document.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'docx': { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', isTextual: false, vscodeLang: binary },
		'dotm': { type: 'application/vnd.ms-word.template.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'dotx': { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', isTextual: false, vscodeLang: binary },
		'mdb': { type: 'application/vnd.ms-access', isTextual: false, vscodeLang: binary },
		'mpp': { type: 'application/vnd.ms-project', isTextual: false, vscodeLang: binary },
		'onetoc|onetoc2|onetmp|onepkg': { type: 'application/onenote', isTextual: false, vscodeLang: binary },
		'oxps': { type: 'application/oxps', isTextual: false, vscodeLang: binary },
		'pot|pps|ppt': { type: 'application/vnd.ms-powerpoint', isTextual: false, vscodeLang: binary },
		'potm': { type: 'application/vnd.ms-powerpoint.template.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'potx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.template', isTextual: false, vscodeLang: binary },
		'ppam': { type: 'application/vnd.ms-powerpoint.addin.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'ppsm': { type: 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'ppsx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', isTextual: false, vscodeLang: binary },
		'pptm': { type: 'application/vnd.ms-powerpoint.presentation.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'pptx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', isTextual: false, vscodeLang: binary },
		'sldm': { type: 'application/vnd.ms-powerpoint.slide.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'sldx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.slide', isTextual: false, vscodeLang: binary },
		'wri': { type: 'application/vnd.ms-write', isTextual: false, vscodeLang: binary },
		'xla|xls|xlt|xlw': { type: 'application/vnd.ms-excel', isTextual: false, vscodeLang: binary },
		'xlam': { type: 'application/vnd.ms-excel.addin.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'xlsb': { type: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'xlsm': { type: 'application/vnd.ms-excel.sheet.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'xlsx': { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', isTextual: false, vscodeLang: binary },
		'xltm': { type: 'application/vnd.ms-excel.template.macroEnabled.12', isTextual: false, vscodeLang: binary },
		'xltx': { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template', isTextual: false, vscodeLang: binary },
		'xps': { type: 'application/vnd.ms-xpsdocument', isTextual: false, vscodeLang: binary },
	},
	'OpenOffice': {
		'odb': { type: 'application/vnd.oasis.opendocument.database', isTextual: false, vscodeLang: binary },
		'odc': { type: 'application/vnd.oasis.opendocument.chart', isTextual: false, vscodeLang: binary },
		'odf': { type: 'application/vnd.oasis.opendocument.formula', isTextual: false, vscodeLang: binary },
		'odg': { type: 'application/vnd.oasis.opendocument.graphics', isTextual: false, vscodeLang: binary },
		'odp': { type: 'application/vnd.oasis.opendocument.presentation', isTextual: false, vscodeLang: binary },
		'ods': { type: 'application/vnd.oasis.opendocument.spreadsheet', isTextual: false, vscodeLang: binary },
		'odt': { type: 'application/vnd.oasis.opendocument.text', isTextual: false, vscodeLang: binary },
	},
	'WordPerfect': {
		'wp|wpd': { type: 'application/wordperfect', isTextual: false, vscodeLang: binary },
	},
	'iWork': {
		'key': { type: 'application/vnd.apple.keynote', isTextual: false, vscodeLang: binary },
		'numbers': { type: 'application/vnd.apple.numbers', isTextual: false, vscodeLang: binary },
		'pages': { type: 'application/vnd.apple.pages', isTextual: false, vscodeLang: binary },
	},
};

/**
 * Prepares extensions.
 */
let _exts: string[] = []; // Initialize.
for (const [, group] of Object.entries(types)) {
	for (const [subgroupExts] of Object.entries(group)) {
		_exts = _exts.concat(subgroupExts.split('|'));
	}
} // We export unique extensions only.
export const exts = [...new Set(_exts.sort())];

/**
 * Extensions piped for use in RegExp.
 */
export const extsPipedForRegExp = exts.join('|');

/**
 * Extensions prepared as a RegExp.
 *
 * @note Matches unnamed dots also; e.g., `.[ext]`.
 */
export const extsRegExp = new RegExp('(?:^|[^.])\\.(' + extsPipedForRegExp + ')$', 'iu');
