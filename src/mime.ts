/**
 * MIME utilities.
 */

import { ext as $pathꓺext } from './path.ts';

/**
 * Defines types.
 */
export type Types = {
	[x: string]: {
		[x: string]: {
			type: string;
			isTextual: boolean;
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
	defaultType = defaultType || 'application/octet-stream';

	if (!fileExt) return defaultType; // Not possible.

	for (const [, group] of Object.entries(types)) {
		for (const [groupExts, groupType] of Object.entries(group)) {
			if (groupExts.split('|').includes(fileExt)) return groupType.type;
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
		'txt': { type: 'text/plain', isTextual: true },
	},
	'Markdown': {
		'md|mdx': { type: 'text/markdown', isTextual: true },
	},
	'Rich Text': {
		'rtf': { type: 'application/rtf', isTextual: false },
		'rtx': { type: 'text/richtext', isTextual: false },
	},
	'HTML': {
		'htm|html|shtm|shtml': { type: 'text/html', isTextual: true },
	},
	'PDF': {
		'pdf': { type: 'application/pdf', isTextual: false },
	},
	'Other Text': {
		'vtt': { type: 'text/vtt', isTextual: true },
		'asc|c|cc|h|srt': { type: 'text/plain', isTextual: true },
	},
	// Backend code w/ dynamic exclusons.
	// {@see $path.staticExts} for dynamic exclusons.

	'Ruby': {
		'rb': { type: 'text/html', isTextual: true }, // Treated as 'dynamic' (i.e., non-static).
	},
	'Python': {
		'py': { type: 'text/html', isTextual: true }, // Treated as 'dynamic' (i.e., non-static).
	},
	'PHP': {
		'php|phtm|phtml': { type: 'text/html', isTextual: true }, // Treated as 'dynamic' (i.e., non-static).
		'phar': { type: 'application/php-archive', isTextual: false },
		'phps': { type: 'application/x-php-source', isTextual: true },
	},
	'ASP': {
		'asp|aspx': { type: 'text/html', isTextual: true }, // Treated as 'dynamic' (i.e., non-static).
	},
	'Perl': {
		'cgi|pl|plx|ppl|perl': { type: 'text/html', isTextual: true }, // Treated as 'dynamic' (i.e., non-static).
	},
	// Other backend code.
	// Not part of our dynamic exclusions.

	'Shell': {
		'sh': { type: 'application/sh', isTextual: true },
		'zsh': { type: 'application/zsh', isTextual: true },
		'bash': { type: 'application/bash', isTextual: true },
		'bat': { type: 'application/octet-stream', isTextual: true },
	},
	'Docker': {
		'dockerfile': { type: 'application/octet-stream', isTextual: true },
	},
	'AppleScript': {
		'applescript': { type: 'application/applescript', isTextual: true },
		'scpt|scptd': { type: 'application/applescript', isTextual: false },
	},
	// Frontend code.

	'JavaScript': {
		'node': { type: 'application/javascript', isTextual: false },
		'js|jsx|cjs|cjsx|mjs|mjsx': { type: 'application/javascript', isTextual: true },
	},
	'TypeScript': {
		'ts|tsx|cts|ctsx|mts|mtsx': { type: 'application/typescript', isTextual: true },
	},
	'Style': {
		'css|sass|scss|less': { type: 'text/css', isTextual: true },
		'xsd': { type: 'application/xsd+xml', isTextual: true },
		'xsl|xslt': { type: 'application/xslt+xml', isTextual: true },
	},
	// Other code.

	'Other Code': {
		'hta': { type: 'application/hta', isTextual: true },
		'htc': { type: 'text/x-component', isTextual: true },
		'class': { type: 'application/java', isTextual: false },
	},
	// Templates.

	'EJS': {
		'ejs': { type: 'text/plain', isTextual: true },
	},
	'Liquid': {
		'liq|liquid': { type: 'text/plain', isTextual: true },
	},
	'Other Template': {
		'tmpl|tpl': { type: 'text/plain', isTextual: true },
	},
	// Data|config files.

	'JSON': {
		'json|json5': { type: 'application/json', isTextual: true },
		'jsonld': { type: 'application/ld+json', isTextual: true },
	},
	'TOML': {
		'toml': { type: 'text/plain', isTextual: true },
	},
	'YAML': {
		'yaml|yml': { type: 'text/plain', isTextual: true },
	},
	'XML': {
		'dtd': { type: 'application/xml-dtd', isTextual: true },
		'xhtm|xhtml': { type: 'application/xhtml+xml', isTextual: true },
		'xml': { type: 'text/xml', isTextual: true },
	},
	'SQL': {
		'sql|sqlite': { type: 'text/plain', isTextual: true },
	},
	'Delimited': {
		'csv': { type: 'text/csv', isTextual: true },
		'tsv': { type: 'text/tab-separated-values', isTextual: true },
	},
	'Calendar': {
		'ics': { type: 'text/calendar', isTextual: true },
	},
	'Feed': {
		'atom': { type: 'application/atom+xml', isTextual: true },
		'rdf': { type: 'application/rdf+xml', isTextual: true },
		'rss-http': { type: 'text/xml', isTextual: true },
		'rss|rss2': { type: 'application/rss+xml', isTextual: true },
	},
	'I18n': {
		'po': { type: 'text/x-gettext-translation', isTextual: true }, // `pot` taken; use `po`.
		'mo': { type: 'application/x-gettext-translation', isTextual: false },
	},
	'Log': {
		'log': { type: 'text/plain', isTextual: true },
	},
	'Other Configuration': {
		'htaccess|htpasswd': { type: 'text/plain', isTextual: true },
		'ini|cfg|conf|properties': { type: 'text/plain', isTextual: true },
		'gitconfig|gitattributes|gitignore|gitchange': { type: 'text/plain', isTextual: true },
		'npmrc|npmignore|yarnrc|babelrc|shellcheckrc|eslintignore|prettierignore': { type: 'text/plain', isTextual: true },
	},
	// Media formats.

	'Image': {
		'ai': { type: 'image/vnd.adobe.illustrator', isTextual: false },
		'apng': { type: 'image/apng', isTextual: false },
		'bmp': { type: 'image/bmp', isTextual: false },
		'eps': { type: 'image/eps', isTextual: false },
		'gif': { type: 'image/gif', isTextual: false },
		'heic': { type: 'image/heic', isTextual: false },
		'ico': { type: 'image/x-icon', isTextual: false },
		'jpg|jpeg|jpe': { type: 'image/jpeg', isTextual: false },
		'pict': { type: 'image/pict', isTextual: false },
		'png': { type: 'image/png', isTextual: false },
		'psd': { type: 'image/vnd.adobe.photoshop', isTextual: false },
		'pspimage': { type: 'image/vnd.corel.psp', isTextual: false },
		'svg': { type: 'image/svg+xml', isTextual: true },
		'svgz': { type: 'image/svg+xml', isTextual: false },
		'tiff|tif': { type: 'image/tiff', isTextual: false },
		'webp': { type: 'image/webp', isTextual: false },
	},
	'Audio': {
		'aac': { type: 'audio/aac', isTextual: false },
		'flac': { type: 'audio/flac', isTextual: false },
		'mid|midi': { type: 'audio/midi', isTextual: false },
		'mka': { type: 'audio/x-matroska', isTextual: false },
		'mp3|m4a|m4b': { type: 'audio/mpeg', isTextual: false },
		'ogg|oga': { type: 'audio/ogg', isTextual: false },
		'pls': { type: 'audio/x-scpls', isTextual: false },
		'ra|ram': { type: 'audio/x-realaudio', isTextual: false },
		'wav': { type: 'audio/wav', isTextual: false },
		'wax': { type: 'audio/x-ms-wax', isTextual: false },
		'wma': { type: 'audio/x-ms-wma', isTextual: false },
	},
	'Video': {
		'3g2|3gp2': { type: 'video/3gpp2', isTextual: false },
		'3gp|3gpp': { type: 'video/3gpp', isTextual: false },
		'asf|asx': { type: 'video/x-ms-asf', isTextual: false },
		'avi': { type: 'video/avi', isTextual: false },
		'divx': { type: 'video/divx', isTextual: false },
		'flv': { type: 'video/x-flv', isTextual: false },
		'mkv': { type: 'video/x-matroska', isTextual: false },
		'mov|qt': { type: 'video/quicktime', isTextual: false },
		'mp4|m4v': { type: 'video/mp4', isTextual: false },
		'mpeg|mpg|mpe': { type: 'video/mpeg', isTextual: false },
		'ogv': { type: 'video/ogg', isTextual: false },
		'webm': { type: 'video/webm', isTextual: false },
		'wm': { type: 'video/x-ms-wm', isTextual: false },
		'wmv': { type: 'video/x-ms-wmv', isTextual: false },
		'wmx': { type: 'video/x-ms-wmx', isTextual: false },
	},
	'Font': {
		'otf': { type: 'application/x-font-otf', isTextual: false },
		'ttf': { type: 'application/x-font-ttf', isTextual: false },
		'woff|woff2': { type: 'application/x-font-woff', isTextual: false },
		'eot': { type: 'application/vnd.ms-fontobject', isTextual: false },
	},
	// Archives.

	'Archive': {
		'7z': { type: 'application/x-7z-compressed', isTextual: false },
		'dmg': { type: 'application/x-apple-diskimage', isTextual: false },
		'gtar': { type: 'application/x-gtar', isTextual: false },
		'gz|tgz|gzip': { type: 'application/x-gzip', isTextual: false },
		'iso': { type: 'application/iso-image', isTextual: false },
		'jar': { type: 'application/java-archive', isTextual: false },
		'rar': { type: 'application/rar', isTextual: false },
		'tar': { type: 'application/x-tar', isTextual: false },
		'zip|sketch': { type: 'application/zip', isTextual: false },
	},
	// Applications.

	'Other Application': {
		'app|xcf': { type: 'application/octet-stream', isTextual: false },
		'bin': { type: 'application/octet-stream', isTextual: false },
		'blend': { type: 'application/x-blender', isTextual: false },
		'com': { type: 'application/octet-stream', isTextual: false },
		'dfxp': { type: 'application/ttaf+xml', isTextual: false },
		'dll': { type: 'application/octet-stream', isTextual: false },
		'exe': { type: 'application/x-msdownload', isTextual: false },
		'pem': { type: 'application/x-pem-file', isTextual: true },
		'so': { type: 'application/octet-stream', isTextual: false },
	},
	// Proprietary.

	'Google': {
		'kml': { type: 'application/vnd.google-earth.kml+xml', isTextual: true },
		'kmz': { type: 'application/vnd.google-earth.kmz', isTextual: false },
	},
	'Adobe': {
		'ps': { type: 'application/postscript', isTextual: false },
		'fla': { type: 'application/vnd.adobe.flash', isTextual: false },
		'swf': { type: 'application/x-shockwave-flash', isTextual: false },
	},
	'MS Office': {
		'doc': { type: 'application/msword', isTextual: false },
		'docm': { type: 'application/vnd.ms-word.document.macroEnabled.12', isTextual: false },
		'docx': { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', isTextual: false },
		'dotm': { type: 'application/vnd.ms-word.template.macroEnabled.12', isTextual: false },
		'dotx': { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', isTextual: false },
		'mdb': { type: 'application/vnd.ms-access', isTextual: false },
		'mpp': { type: 'application/vnd.ms-project', isTextual: false },
		'onetoc|onetoc2|onetmp|onepkg': { type: 'application/onenote', isTextual: false },
		'oxps': { type: 'application/oxps', isTextual: false },
		'pot|pps|ppt': { type: 'application/vnd.ms-powerpoint', isTextual: false },
		'potm': { type: 'application/vnd.ms-powerpoint.template.macroEnabled.12', isTextual: false },
		'potx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.template', isTextual: false },
		'ppam': { type: 'application/vnd.ms-powerpoint.addin.macroEnabled.12', isTextual: false },
		'ppsm': { type: 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12', isTextual: false },
		'ppsx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', isTextual: false },
		'pptm': { type: 'application/vnd.ms-powerpoint.presentation.macroEnabled.12', isTextual: false },
		'pptx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', isTextual: false },
		'sldm': { type: 'application/vnd.ms-powerpoint.slide.macroEnabled.12', isTextual: false },
		'sldx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.slide', isTextual: false },
		'wri': { type: 'application/vnd.ms-write', isTextual: false },
		'xla|xls|xlt|xlw': { type: 'application/vnd.ms-excel', isTextual: false },
		'xlam': { type: 'application/vnd.ms-excel.addin.macroEnabled.12', isTextual: false },
		'xlsb': { type: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12', isTextual: false },
		'xlsm': { type: 'application/vnd.ms-excel.sheet.macroEnabled.12', isTextual: false },
		'xlsx': { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', isTextual: false },
		'xltm': { type: 'application/vnd.ms-excel.template.macroEnabled.12', isTextual: false },
		'xltx': { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template', isTextual: false },
		'xps': { type: 'application/vnd.ms-xpsdocument', isTextual: false },
	},
	'OpenOffice': {
		'odb': { type: 'application/vnd.oasis.opendocument.database', isTextual: false },
		'odc': { type: 'application/vnd.oasis.opendocument.chart', isTextual: false },
		'odf': { type: 'application/vnd.oasis.opendocument.formula', isTextual: false },
		'odg': { type: 'application/vnd.oasis.opendocument.graphics', isTextual: false },
		'odp': { type: 'application/vnd.oasis.opendocument.presentation', isTextual: false },
		'ods': { type: 'application/vnd.oasis.opendocument.spreadsheet', isTextual: false },
		'odt': { type: 'application/vnd.oasis.opendocument.text', isTextual: false },
	},
	'WordPerfect': {
		'wp|wpd': { type: 'application/wordperfect', isTextual: false },
	},
	'iWork': {
		'key': { type: 'application/vnd.apple.keynote', isTextual: false },
		'numbers': { type: 'application/vnd.apple.numbers', isTextual: false },
		'pages': { type: 'application/vnd.apple.pages', isTextual: false },
	},
};

/**
 * Prepares extensions.
 */
let _exts: string[] = [];

for (const [, group] of Object.entries(types)) {
	for (const [groupExts] of Object.entries(group)) {
		_exts = _exts.concat(groupExts.split('|'));
	}
} // We export unique extensions only.
export const exts = [...new Set([..._exts.sort()])];

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
