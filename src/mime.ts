/**
 * MIME utilities.
 */

import { ext as $pathꓺext } from './path.ts';

// Frequently used strings.
const vsCodeLangBinary = 'code-text-binary';
const mimeTypeStream = 'application/octet-stream';

/**
 * Defines types.
 */
export type Types = {
	[x: string]: {
		[x: string]: {
			type: string;
			isTextual: boolean;
			vsCodeLang: string;
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
	defaultType = defaultType || mimeTypeStream;

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
		'txt': { type: 'text/plain', isTextual: true, vsCodeLang: 'plaintext' },
	},
	'Markdown': {
		'md': { type: 'text/markdown', isTextual: true, vsCodeLang: 'markdown' },
		'mdx': { type: 'text/markdown', isTextual: true, vsCodeLang: 'mdx' },
	},
	'Rich Text': {
		'rtf': { type: 'application/rtf', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'rtx': { type: 'text/richtext', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'HTML': {
		// If this changes, also update extensions lib in `clevercanyon/skeleton` dotfiles.
		'htm|html': { type: 'text/html', isTextual: true, vsCodeLang: 'html' },
		'shtm|shtml': { type: 'text/html', isTextual: true, vsCodeLang: 'html' },
	},
	'PDF': {
		'pdf': { type: 'application/pdf', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'Other Text': {
		'vtt': { type: 'text/vtt', isTextual: true, vsCodeLang: 'plaintext' },
		'asc|c|cc|h|srt': { type: 'text/plain', isTextual: true, vsCodeLang: 'plaintext' },
	},
	// Backend code w/ dynamic exclusons.
	// {@see $path.staticExts} for dynamic exclusons.

	'PHP': {
		'php|phtm|phtml': { type: 'text/html', isTextual: true, vsCodeLang: 'php' },
	},
	'Ruby': {
		'rb': { type: 'text/html', isTextual: true, vsCodeLang: 'ruby' },
	},
	'Python': {
		'py': { type: 'text/html', isTextual: true, vsCodeLang: 'python' },
	},
	'ASP': {
		'asp|aspx': { type: 'text/html', isTextual: true, vsCodeLang: 'plaintext' },
	},
	'Perl': {
		'pl6|perl6': { type: 'text/html', isTextual: true, vsCodeLang: 'perl6' },
		'cgi|pl|plx|ppl|perl': { type: 'text/html', isTextual: true, vsCodeLang: 'perl' },
	},
	'Shell': {
		'sh|zsh|bash': { type: 'text/html', isTextual: true, vsCodeLang: 'shellscript' },
	},
	// Other backend code formats.
	// Not part of our dynamic exclusions.

	'Node Archive': {
		'node': { type: 'application/x-node-archive', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'PHP Archive': {
		'phar': { type: 'application/x-php-archive', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'PHP Source': {
		'phps': { type: 'application/x-php-source', isTextual: true, vsCodeLang: 'php' },
	},
	'Docker': {
		'dockerfile': { type: mimeTypeStream, isTextual: true, vsCodeLang: 'dockerfile' },
	},
	'JS Automation': {
		'jxa': { type: 'application/javascript', isTextual: true, vsCodeLang: 'jxa' },
	},
	'AppleScript': {
		'applescript': { type: 'application/applescript', isTextual: true, vsCodeLang: 'applescript' },
		'scpt|scptd': { type: 'application/applescript', isTextual: false, vsCodeLang: 'applescript.binary' },
	},
	'Batch': {
		'bat': { type: 'text/html', isTextual: true, vsCodeLang: 'bat' }, // Windows batch file.
	},
	// Frontend code (most of the time).

	'JavaScript': {
		// If this changes, also update extensions lib in `clevercanyon/skeleton` dotfiles.
		'wasm': { type: 'application/wasm', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'js|cjs|mjs': { type: 'application/javascript', isTextual: true, vsCodeLang: 'javascript' },
		'jsx|cjsx|mjsx': { type: 'application/javascript', isTextual: true, vsCodeLang: 'javascriptreact' },
	},
	'TypeScript': {
		// If this changes, also update extensions lib in `clevercanyon/skeleton` dotfiles.
		'ts|cts|mts': { type: 'application/typescript', isTextual: true, vsCodeLang: 'typescript' },
		'tsx|ctsx|mtsx': { type: 'application/typescript', isTextual: true, vsCodeLang: 'typescriptreact' },
	},
	'Style': {
		'css': { type: 'text/css', isTextual: true, vsCodeLang: 'css' },
		'scss': { type: 'text/css', isTextual: true, vsCodeLang: 'scss' },
		'less': { type: 'text/css', isTextual: true, vsCodeLang: 'less' },
		'xsd': { type: 'application/xsd+xml', isTextual: true, vsCodeLang: 'xml' },
		'xsl|xslt': { type: 'application/xslt+xml', isTextual: true, vsCodeLang: 'xml' },
	},
	// Other code.

	'Other Code': {
		'hta': { type: 'application/hta', isTextual: true, vsCodeLang: 'plaintext' },
		'htc': { type: 'text/x-component', isTextual: true, vsCodeLang: 'plaintext' },
		'class': { type: 'application/java', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	// Templates.

	'EJS': {
		'ejs': { type: 'text/plain', isTextual: true, vsCodeLang: 'html' },
	},
	'Liquid': {
		'liq|liquid': { type: 'text/plain', isTextual: true, vsCodeLang: 'liquid' },
	},
	'Other Template': {
		'tpl|tmpl': { type: 'text/plain', isTextual: true, vsCodeLang: 'plaintext' },
	},
	// Data|config files.

	'SQL': {
		'sql|sqlite': { type: 'text/plain', isTextual: true, vsCodeLang: 'sql' },
	},
	'Delimited': {
		'csv': { type: 'text/csv', isTextual: true, vsCodeLang: 'plaintext' },
		'tsv': { type: 'text/tab-separated-values', isTextual: true, vsCodeLang: 'plaintext' },
	},
	'JSON': {
		'json': { type: 'application/json', isTextual: true, vsCodeLang: 'json' },
		'json5': { type: 'application/json5', isTextual: true, vsCodeLang: 'jsonc' },
		'jsonld': { type: 'application/ld+json', isTextual: true, vsCodeLang: 'json' },
	},
	'TOML': {
		'toml': { type: 'text/plain', isTextual: true, vsCodeLang: 'toml' },
	},
	'YAML': {
		'yaml|yml': { type: 'text/plain', isTextual: true, vsCodeLang: 'yaml' },
	},
	'INI': {
		'ini': { type: 'text/plain', isTextual: true, vsCodeLang: 'ini' },
	},
	'Properties': {
		'env|env.*': { type: 'text/plain', isTextual: true, vsCodeLang: 'properties' },
		'properties|props': { type: 'text/plain', isTextual: true, vsCodeLang: 'properties' },
		'exacolors': { type: 'text/plain', isTextual: true, vsCodeLang: 'properties' },
	},
	'Apache': {
		'conf': { type: 'text/plain', isTextual: true, vsCodeLang: 'apacheconf' },
		'htaccess|htpasswd': { type: 'text/plain', isTextual: true, vsCodeLang: 'apacheconf' },
	},
	'I18n': {
		'po': { type: 'text/x-gettext-translation', isTextual: true, vsCodeLang: 'plaintext' }, // `pot` taken; use `po`.
		'mo': { type: 'application/x-gettext-translation', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'XML': {
		'dtd': { type: 'application/xml-dtd', isTextual: true, vsCodeLang: 'xml' },
		'xhtm|xhtml': { type: 'application/xhtml+xml', isTextual: true, vsCodeLang: 'xml' },
		'xml': { type: 'text/xml', isTextual: true, vsCodeLang: 'xml' },
	},
	'Calendar': {
		'ics': { type: 'text/calendar', isTextual: true, vsCodeLang: 'plaintext' },
	},
	'Feed': {
		'atom': { type: 'application/atom+xml', isTextual: true, vsCodeLang: 'xml' },
		'rdf': { type: 'application/rdf+xml', isTextual: true, vsCodeLang: 'xml' },
		'rss-http': { type: 'text/xml', isTextual: true, vsCodeLang: 'xml' },
		'rss|rss2': { type: 'application/rss+xml', isTextual: true, vsCodeLang: 'xml' },
	},
	'Log': {
		'log': { type: 'text/plain', isTextual: true, vsCodeLang: 'plaintext' },
	},
	'Other Data': {
		'hex': { type: mimeTypeStream, isTextual: false, vsCodeLang: 'hexEditor.hexedit' },
	},
	'Other Config': {
		'babelrc': { type: 'text/plain', isTextual: true, vsCodeLang: 'jsonc' },
		'npmrc': { type: 'text/plain', isTextual: true, vsCodeLang: 'properties' },
		'yarnrc': { type: 'text/plain', isTextual: true, vsCodeLang: 'plaintext' },
		'inputrc': { type: 'text/plain', isTextual: true, vsCodeLang: 'plaintext' },
		'tsbuildinfo': { type: 'text/plain', isTextual: true, vsCodeLang: 'plaintext' },
		'editorconfig': { type: 'text/plain', isTextual: true, vsCodeLang: 'editorconfig' },
		'shellcheckrc': { type: 'text/plain', isTextual: true, vsCodeLang: 'shellcheckrc' },
		'browserslistrc': { type: 'text/plain', isTextual: true, vsCodeLang: 'browserslist' },

		'gitchange': { type: 'text/plain', isTextual: true, vsCodeLang: 'plaintext' },
		'gitconfig|gitattributes': { type: 'text/plain', isTextual: true, vsCodeLang: 'properties' },

		'gitignore|npmignore|eslintignore|prettierignore': { type: 'text/plain', isTextual: true, vsCodeLang: 'ignore' },
	},
	// Media formats.

	'Image': {
		'ai': { type: 'image/vnd.adobe.illustrator', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'apng': { type: 'image/apng', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'bmp': { type: 'image/bmp', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'eps': { type: 'image/eps', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'gif': { type: 'image/gif', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'heic': { type: 'image/heic', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'ico': { type: 'image/x-icon', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'jpg|jpeg|jpe': { type: 'image/jpeg', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'pict': { type: 'image/pict', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'png': { type: 'image/png', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'psd': { type: 'image/vnd.adobe.photoshop', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'pspimage': { type: 'image/vnd.corel.psp', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'svg': { type: 'image/svg+xml', isTextual: true, vsCodeLang: 'xml' },
		'svgz': { type: 'image/svg+xml', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'tiff|tif': { type: 'image/tiff', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'webp': { type: 'image/webp', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'Audio': {
		'aac': { type: 'audio/aac', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'flac': { type: 'audio/flac', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'mid|midi': { type: 'audio/midi', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'mka': { type: 'audio/x-matroska', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'mp3|m4a|m4b': { type: 'audio/mpeg', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'ogg|oga': { type: 'audio/ogg', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'pls': { type: 'audio/x-scpls', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'ra|ram': { type: 'audio/x-realaudio', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'wav': { type: 'audio/wav', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'wax': { type: 'audio/x-ms-wax', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'wma': { type: 'audio/x-ms-wma', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'Video': {
		'3g2|3gp2': { type: 'video/3gpp2', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'3gp|3gpp': { type: 'video/3gpp', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'asf|asx': { type: 'video/x-ms-asf', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'avi': { type: 'video/avi', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'divx': { type: 'video/divx', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'flv': { type: 'video/x-flv', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'mkv': { type: 'video/x-matroska', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'mov|qt': { type: 'video/quicktime', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'mp4|m4v': { type: 'video/mp4', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'mpeg|mpg|mpe': { type: 'video/mpeg', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'ogv': { type: 'video/ogg', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'webm': { type: 'video/webm', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'wm': { type: 'video/x-ms-wm', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'wmv': { type: 'video/x-ms-wmv', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'wmx': { type: 'video/x-ms-wmx', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'Font': {
		'otf': { type: 'application/x-font-otf', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'ttf': { type: 'application/x-font-ttf', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'woff|woff2': { type: 'application/x-font-woff', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'eot': { type: 'application/vnd.ms-fontobject', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	// Archives.

	'Archive': {
		'7z': { type: 'application/x-7z-compressed', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'dmg': { type: 'application/x-apple-diskimage', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'gtar': { type: 'application/x-gtar', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'gz|tgz|gzip': { type: 'application/x-gzip', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'iso': { type: 'application/iso-image', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'jar': { type: 'application/java-archive', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'rar': { type: 'application/rar', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'tar': { type: 'application/x-tar', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'zip|sketch': { type: 'application/zip', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	// Certificates.

	'Certificate': {
		'csr|crt|pem': { type: 'text/plain', isTextual: true, vsCodeLang: 'plaintext' },
	},
	// Applications.

	'Other Application': {
		'app|xcf': { type: mimeTypeStream, isTextual: false, vsCodeLang: vsCodeLangBinary },
		'bin': { type: mimeTypeStream, isTextual: false, vsCodeLang: vsCodeLangBinary },
		'blend': { type: 'application/x-blender', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'com': { type: mimeTypeStream, isTextual: false, vsCodeLang: vsCodeLangBinary },
		'dfxp': { type: 'application/ttaf+xml', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'dll': { type: mimeTypeStream, isTextual: false, vsCodeLang: vsCodeLangBinary },
		'exe': { type: 'application/x-msdownload', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'so': { type: mimeTypeStream, isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	// Proprietary.

	'Google': {
		'kml': { type: 'application/vnd.google-earth.kml+xml', isTextual: true, vsCodeLang: 'xml' },
		'kmz': { type: 'application/vnd.google-earth.kmz', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'Adobe': {
		'ps': { type: 'application/postscript', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'fla': { type: 'application/vnd.adobe.flash', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'swf': { type: 'application/x-shockwave-flash', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'MS Office': {
		'doc': { type: 'application/msword', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'docm': { type: 'application/vnd.ms-word.document.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'docx': { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'dotm': { type: 'application/vnd.ms-word.template.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'dotx': { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'mdb': { type: 'application/vnd.ms-access', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'mpp': { type: 'application/vnd.ms-project', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'onetoc|onetoc2|onetmp|onepkg': { type: 'application/onenote', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'oxps': { type: 'application/oxps', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'pot|pps|ppt': { type: 'application/vnd.ms-powerpoint', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'potm': { type: 'application/vnd.ms-powerpoint.template.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'potx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.template', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'ppam': { type: 'application/vnd.ms-powerpoint.addin.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'ppsm': { type: 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'ppsx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'pptm': { type: 'application/vnd.ms-powerpoint.presentation.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'pptx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'sldm': { type: 'application/vnd.ms-powerpoint.slide.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'sldx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.slide', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'wri': { type: 'application/vnd.ms-write', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'xla|xls|xlt|xlw': { type: 'application/vnd.ms-excel', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'xlam': { type: 'application/vnd.ms-excel.addin.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'xlsb': { type: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'xlsm': { type: 'application/vnd.ms-excel.sheet.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'xlsx': { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'xltm': { type: 'application/vnd.ms-excel.template.macroEnabled.12', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'xltx': { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'xps': { type: 'application/vnd.ms-xpsdocument', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'OpenOffice': {
		'odb': { type: 'application/vnd.oasis.opendocument.database', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'odc': { type: 'application/vnd.oasis.opendocument.chart', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'odf': { type: 'application/vnd.oasis.opendocument.formula', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'odg': { type: 'application/vnd.oasis.opendocument.graphics', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'odp': { type: 'application/vnd.oasis.opendocument.presentation', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'ods': { type: 'application/vnd.oasis.opendocument.spreadsheet', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'odt': { type: 'application/vnd.oasis.opendocument.text', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'WordPerfect': {
		'wp|wpd': { type: 'application/wordperfect', isTextual: false, vsCodeLang: vsCodeLangBinary },
	},
	'iWork': {
		'key': { type: 'application/vnd.apple.keynote', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'numbers': { type: 'application/vnd.apple.numbers', isTextual: false, vsCodeLang: vsCodeLangBinary },
		'pages': { type: 'application/vnd.apple.pages', isTextual: false, vsCodeLang: vsCodeLangBinary },
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
