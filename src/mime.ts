/**
 * MIME utilities.
 */

import { $path } from './index.ts';

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
            binary: boolean;
            canonical: string;
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
    const fileExt = $path.ext(file); // File extension.
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
        case contentType.endsWith('+xml'):
        case contentType.endsWith('+json'):
        case 'application/json' === contentType:
        case 'application/json5' === contentType:
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
 *
 * The top-level groups defined here in 'Title Case' are intended for future use as a means of improving UX when listing
 * files out in ways that group them by extension. As of right now, there is no problem reorganizing them in any way.
 *
 * The extensions within each canonical group are sorted by priority with the canonical extension appearing first.
 * Suitable for pattern matching prioritization. {@see $path.extsByCanonical()} {@see $path.canonicalExtVariants()}.
 * Additionally, we expect the same prioritization when extracting extensions by VS Code lang. Thus, it is important to
 * both order the extensions in each subgroup, and also to declare the extensions in order of VS Code lang priority.
 *
 * Strictly speaking, VS Code langs are caSe-sensitive; {@see https://o5p.me/bmWI0c}. However, we do provide an option
 * to camelCase them when extracting; {@see $path.extsByVSCodeLang()}. If you add any new VS Code langs that are not in
 * camelCase format already, please add conditionals for them in {@see $path.extsByVSCodeLang()}. For script types, such
 * as `shellscript`, `applescript`, `javascript`, `typescript`, `dockerfile`, we don’t camelCase, as it’s confusing.
 *
 * @note It is not permissable to include glob patterns for extensions here.
 *       If there are variants, please list them explicitly. For anything dynamic-ish,
 *       exceptions will have to be made in your implementation — not here.
 */
export const types: Types = {
    // Documents.

    'Text': {
        'txt|text': { type: 'text/plain', binary: false, canonical: 'txt', vsCodeLang: 'plaintext' },
    },
    'Markdown': {
        'mdx': { type: 'text/markdown', binary: false, canonical: 'mdx', vsCodeLang: 'mdx' },
        'md|markdown|mdown|mdwn|mkd|mdtxt|mdtext': { type: 'text/markdown', binary: false, canonical: 'md', vsCodeLang: 'markdown' },
    },
    'Rich Text': {
        'rtx': { type: 'text/richtext', binary: true, canonical: 'rtx', vsCodeLang: vsCodeLangBinary },
        'rtf': { type: 'application/rtf', binary: true, canonical: 'rtf', vsCodeLang: vsCodeLangBinary },
    },
    'HTML': {
        'html|htm': { type: 'text/html', binary: false, canonical: 'html', vsCodeLang: 'html' },
        'shtml|shtm': { type: 'text/html', binary: false, canonical: 'shtml', vsCodeLang: 'html' },
        'xhtml|xhtm': { type: 'application/xhtml+xml', binary: false, canonical: 'xhtml', vsCodeLang: 'html' },
    },
    'PDF': {
        'pdf': { type: 'application/pdf', binary: true, canonical: 'pdf', vsCodeLang: vsCodeLangBinary },
    },
    // Backend code w/ dynamic exclusons.
    // {@see $path.staticExts} for dynamic exclusons.

    'PHP': {
        'php|phtml|phtm': { type: 'text/html', binary: false, canonical: 'php', vsCodeLang: 'php' },
    },
    // Other backend code formats.
    // Not part of our dynamic exclusions.

    'PHP Source': {
        'phps': { type: 'application/x-php-source', binary: false, canonical: 'phps', vsCodeLang: 'php' },
    },
    'ASP': {
        'asp|aspx': { type: 'text/html', binary: false, canonical: 'asp', vsCodeLang: 'asp' },
    },
    'Ruby': {
        'rb': { type: 'text/html', binary: false, canonical: 'rb', vsCodeLang: 'ruby' },
    },
    'Python': {
        'py': { type: 'text/html', binary: false, canonical: 'py', vsCodeLang: 'python' },
    },
    'Perl': {
        'pl6|perl6': { type: 'text/html', binary: false, canonical: 'pl6', vsCodeLang: 'perl6' },
        'pl|plx|cgi|ppl|perl': { type: 'text/html', binary: false, canonical: 'pl', vsCodeLang: 'perl' },
    },
    'Shell': {
        'bash': { type: 'text/html', binary: false, canonical: 'bash', vsCodeLang: 'shellscript' },
        'zsh': { type: 'text/html', binary: false, canonical: 'zsh', vsCodeLang: 'shellscript' },
        'sh': { type: 'text/html', binary: false, canonical: 'sh', vsCodeLang: 'shellscript' },
    },
    'C': {
        'c': { type: 'text/plain', binary: false, canonical: 'c', vsCodeLang: 'c' },
        'cs': { type: 'text/plain', binary: false, canonical: 'cs', vsCodeLang: 'csharp' },
        'cpp|cc': { type: 'text/plain', binary: false, canonical: 'cpp', vsCodeLang: 'cpp' },
        'o': { type: 'text/plain', binary: false, canonical: 'o', vsCodeLang: 'cpp' },
        'h': { type: 'text/plain', binary: false, canonical: 'h', vsCodeLang: 'cpp' },
    },
    'Docker': {
        'dockerfile': { type: mimeTypeStream, binary: false, canonical: 'dockerfile', vsCodeLang: 'dockerfile' },
    },
    'JS Automation': {
        'jxa': { type: 'application/javascript', binary: false, canonical: 'jxa', vsCodeLang: 'jxa' },
    },
    'AppleScript': {
        'applescript': { type: 'application/applescript', binary: false, canonical: 'applescript', vsCodeLang: 'applescript' },
        'scpt|scptd': { type: 'application/applescript', binary: true, canonical: 'scpt', vsCodeLang: 'applescript.binary' },
    },
    'Batch': {
        'bat': { type: 'text/plain', binary: false, canonical: 'bat', vsCodeLang: 'bat' },
    },
    // Frontend code (most of the time).

    'JavaScript': {
        // If this changes, also update extensions lib in `clevercanyon/skeleton` dotfiles.
        'wasm': { type: 'application/wasm', binary: true, canonical: 'wasm', vsCodeLang: vsCodeLangBinary },
        'js|mjs|cjs': { type: 'application/javascript', binary: false, canonical: 'js', vsCodeLang: 'javascript' },
        'jsx|mjsx|cjsx': { type: 'application/javascript', binary: false, canonical: 'jsx', vsCodeLang: 'javascriptreact' },
    },
    'TypeScript': {
        // If this changes, also update extensions lib in `clevercanyon/skeleton` dotfiles.
        'ts|mts|cts': { type: 'application/typescript', binary: false, canonical: 'ts', vsCodeLang: 'typescript' },
        'tsx|mtsx|ctsx': { type: 'application/typescript', binary: false, canonical: 'tsx', vsCodeLang: 'typescriptreact' },
    },
    'Style': {
        'css': { type: 'text/css', binary: false, canonical: 'css', vsCodeLang: 'css' },
        'scss': { type: 'text/css', binary: false, canonical: 'scss', vsCodeLang: 'scss' },
        'less': { type: 'text/css', binary: false, canonical: 'less', vsCodeLang: 'less' },
        'xsl|xslt': { type: 'application/xslt+xml', binary: false, canonical: 'xsl', vsCodeLang: 'xml' },
    },
    // Other code.

    'Other Code': {
        'hta': { type: 'application/hta', binary: false, canonical: 'hta', vsCodeLang: 'plaintext' },
        'htc': { type: 'text/x-component', binary: false, canonical: 'htc', vsCodeLang: 'plaintext' },
        'class': { type: 'application/java', binary: true, canonical: 'class', vsCodeLang: vsCodeLangBinary },
    },
    // Templates.

    'EJS': {
        'ejs': { type: 'text/plain', binary: false, canonical: 'ejs', vsCodeLang: 'html' },
    },
    'Liquid': {
        'liquid': { type: 'text/plain', binary: false, canonical: 'liquid', vsCodeLang: 'html' },
    },
    'Other Template': {
        'tpl': { type: 'text/plain', binary: false, canonical: 'tpl', vsCodeLang: 'plaintext' },
    },
    // Data|config files.

    'SQL': {
        'sql|sqlite': { type: 'text/plain', binary: false, canonical: 'sql', vsCodeLang: 'sql' },
    },
    'Delimited': {
        'csv': { type: 'text/csv', binary: false, canonical: 'csv', vsCodeLang: 'plaintext' },
        'tsv': { type: 'text/tab-separated-values', binary: false, canonical: 'tsv', vsCodeLang: 'plaintext' },
    },
    'JSON': {
        'json': { type: 'application/json', binary: false, canonical: 'json', vsCodeLang: 'json' },
        'json5': { type: 'application/json5', binary: false, canonical: 'json5', vsCodeLang: 'jsonc' },
        'jsonld': { type: 'application/ld+json', binary: false, canonical: 'jsonld', vsCodeLang: 'json' },
    },
    'TOML': {
        'toml': { type: 'text/plain', binary: false, canonical: 'toml', vsCodeLang: 'toml' },
    },
    'YAML': {
        'yaml|yml': { type: 'text/plain', binary: false, canonical: 'yaml', vsCodeLang: 'yaml' },
    },
    'INI': {
        'ini': { type: 'text/plain', binary: false, canonical: 'ini', vsCodeLang: 'ini' },
    },
    'Properties': {
        'env': { type: 'text/plain', binary: false, canonical: 'env', vsCodeLang: 'properties' },
        'props|properties': { type: 'text/plain', binary: false, canonical: 'props', vsCodeLang: 'properties' },
    },
    'Apache': {
        'conf': { type: 'text/plain', binary: false, canonical: 'conf', vsCodeLang: 'apacheconf' },
        'htaccess': { type: 'text/plain', binary: false, canonical: 'htaccess', vsCodeLang: 'apacheconf' },
        'htpasswd': { type: 'text/plain', binary: false, canonical: 'htpasswd', vsCodeLang: 'apacheconf' },
    },
    'I18n': {
        'po|pot': { type: 'text/x-gettext-translation', binary: false, canonical: 'po', vsCodeLang: 'plaintext' },
        'mo': { type: 'application/x-gettext-translation', binary: true, canonical: 'mo', vsCodeLang: vsCodeLangBinary },
    },
    'XML': {
        'xml': { type: 'text/xml', binary: false, canonical: 'xml', vsCodeLang: 'xml' },
        'xsd': { type: 'application/xsd+xml', binary: false, canonical: 'xsd', vsCodeLang: 'xml' },
        'dtd': { type: 'application/xml-dtd', binary: false, canonical: 'dtd', vsCodeLang: 'xml' },
    },
    'Calendar': {
        'ics': { type: 'text/calendar', binary: false, canonical: 'ics', vsCodeLang: 'plaintext' },
    },
    'Feed': {
        'atom': { type: 'application/atom+xml', binary: false, canonical: 'atom', vsCodeLang: 'xml' },
        'rdf': { type: 'application/rdf+xml', binary: false, canonical: 'rdf', vsCodeLang: 'xml' },
        'rss|rss2': { type: 'application/rss+xml', binary: false, canonical: 'rss', vsCodeLang: 'xml' },
        'rss-http': { type: 'text/xml', binary: false, canonical: 'rss', vsCodeLang: 'xml' },
    },
    'Log': {
        'log': { type: 'text/plain', binary: false, canonical: 'log', vsCodeLang: 'plaintext' },
    },
    'Other Data': {
        // ASX is an XML file w/ a weird MIME type; {@see https://o5p.me/Bqt8Zi}.
        'asx': { type: 'video/x-ms-asf', binary: true, canonical: 'asx', vsCodeLang: 'xml' },
        'vtt': { type: 'text/vtt', binary: false, canonical: 'vtt', vsCodeLang: 'plaintext' },
        'srt': { type: 'text/plain', binary: false, canonical: 'srt', vsCodeLang: 'plaintext' },
        'dfxp': { type: 'application/ttaf+xml', binary: false, canonical: 'dfxp', vsCodeLang: 'xml' },
        'hex': { type: mimeTypeStream, binary: true, canonical: 'hex', vsCodeLang: 'hexEditor.hexedit' },
    },
    'Other Config': {
        'babelrc': { type: 'text/plain', binary: false, canonical: 'babelrc', vsCodeLang: 'jsonc' },
        'npmrc': { type: 'text/plain', binary: false, canonical: 'npmrc', vsCodeLang: 'properties' },
        'yarnrc': { type: 'text/plain', binary: false, canonical: 'yarnrc', vsCodeLang: 'plaintext' },
        'inputrc': { type: 'text/plain', binary: false, canonical: 'inputrc', vsCodeLang: 'plaintext' },
        'tsbuildinfo': { type: 'text/plain', binary: false, canonical: 'tsbuildinfo', vsCodeLang: 'plaintext' },
        'editorconfig': { type: 'text/plain', binary: false, canonical: 'editorconfig', vsCodeLang: 'properties' },
        'shellcheckrc': { type: 'text/plain', binary: false, canonical: 'shellcheckrc', vsCodeLang: 'shellcheckrc' },
        'browserslistrc': { type: 'text/plain', binary: false, canonical: 'browserslistrc', vsCodeLang: 'browserslist' },

        'gitchange': { type: 'text/plain', binary: false, canonical: 'gitchange', vsCodeLang: 'plaintext' },
        'gitconfig': { type: 'text/plain', binary: false, canonical: 'gitconfig', vsCodeLang: 'properties' },
        'gitattributes': { type: 'text/plain', binary: false, canonical: 'gitattributes', vsCodeLang: 'ignore' },

        'gitignore': { type: 'text/plain', binary: false, canonical: 'gitignore', vsCodeLang: 'ignore' },
        'npmignore': { type: 'text/plain', binary: false, canonical: 'npmignore', vsCodeLang: 'ignore' },
        'dockerignore': { type: 'text/plain', binary: false, canonical: 'dockerignore', vsCodeLang: 'ignore' },
        'vscodeignore': { type: 'text/plain', binary: false, canonical: 'vscodeignore', vsCodeLang: 'ignore' },
        'prettierignore': { type: 'text/plain', binary: false, canonical: 'prettierignore', vsCodeLang: 'ignore' },
        'eslintignore': { type: 'text/plain', binary: false, canonical: 'eslintignore', vsCodeLang: 'ignore' },
    },
    // Media formats.

    'Image': {
        'ai': { type: 'image/vnd.adobe.illustrator', binary: true, canonical: 'ai', vsCodeLang: vsCodeLangBinary },
        'bmp': { type: 'image/bmp', binary: true, canonical: 'bmp', vsCodeLang: vsCodeLangBinary },
        'eps': { type: 'image/eps', binary: true, canonical: 'eps', vsCodeLang: vsCodeLangBinary },
        'gif': { type: 'image/gif', binary: true, canonical: 'gif', vsCodeLang: vsCodeLangBinary },
        'heic': { type: 'image/heic', binary: true, canonical: 'heic', vsCodeLang: vsCodeLangBinary },
        'ico': { type: 'image/x-icon', binary: true, canonical: 'ico', vsCodeLang: vsCodeLangBinary },
        'jpg|jpeg|jpe': { type: 'image/jpeg', binary: true, canonical: 'jpg', vsCodeLang: vsCodeLangBinary },
        'pict': { type: 'image/pict', binary: true, canonical: 'pict', vsCodeLang: vsCodeLangBinary },
        'png': { type: 'image/png', binary: true, canonical: 'png', vsCodeLang: vsCodeLangBinary },
        'apng': { type: 'image/apng', binary: true, canonical: 'apng', vsCodeLang: vsCodeLangBinary },
        'xcf': { type: mimeTypeStream, binary: true, canonical: 'xcf', vsCodeLang: vsCodeLangBinary },
        'psd': { type: 'image/vnd.adobe.photoshop', binary: true, canonical: 'psd', vsCodeLang: vsCodeLangBinary },
        'pspimage': { type: 'image/vnd.corel.psp', binary: true, canonical: 'pspimage', vsCodeLang: vsCodeLangBinary },
        'svg': { type: 'image/svg+xml', binary: false, canonical: 'svg', vsCodeLang: 'xml' },
        'svgz': { type: 'image/svg+xml', binary: true, canonical: 'svgz', vsCodeLang: vsCodeLangBinary },
        'tiff|tif': { type: 'image/tiff', binary: true, canonical: 'tiff', vsCodeLang: vsCodeLangBinary },
        'webp': { type: 'image/webp', binary: true, canonical: 'webp', vsCodeLang: vsCodeLangBinary },
    },
    'Audio': {
        'aac': { type: 'audio/aac', binary: true, canonical: 'aac', vsCodeLang: vsCodeLangBinary },
        'flac': { type: 'audio/flac', binary: true, canonical: 'flac', vsCodeLang: vsCodeLangBinary },
        'mid|midi': { type: 'audio/midi', binary: true, canonical: 'mid', vsCodeLang: vsCodeLangBinary },
        'mka': { type: 'audio/x-matroska', binary: true, canonical: 'mka', vsCodeLang: vsCodeLangBinary },
        'mp3': { type: 'audio/mpeg', binary: true, canonical: 'mp3', vsCodeLang: vsCodeLangBinary },
        'm4a': { type: 'audio/mpeg', binary: true, canonical: 'm4a', vsCodeLang: vsCodeLangBinary },
        'm4b': { type: 'audio/mpeg', binary: true, canonical: 'm4b', vsCodeLang: vsCodeLangBinary },
        'ogg': { type: 'audio/ogg', binary: true, canonical: 'ogg', vsCodeLang: vsCodeLangBinary },
        'oga': { type: 'audio/ogg', binary: true, canonical: 'oga', vsCodeLang: vsCodeLangBinary },
        'pls': { type: 'audio/x-scpls', binary: true, canonical: 'pls', vsCodeLang: vsCodeLangBinary },
        'ra|ram': { type: 'audio/x-realaudio', binary: true, canonical: 'ra', vsCodeLang: vsCodeLangBinary },
        'wav': { type: 'audio/wav', binary: true, canonical: 'wav', vsCodeLang: vsCodeLangBinary },
        'wax': { type: 'audio/x-ms-wax', binary: true, canonical: 'wax', vsCodeLang: vsCodeLangBinary },
        'wma': { type: 'audio/x-ms-wma', binary: true, canonical: 'wma', vsCodeLang: vsCodeLangBinary },
    },
    'Video': {
        'asf': { type: 'video/x-ms-asf', binary: true, canonical: 'asf', vsCodeLang: vsCodeLangBinary },
        'avi': { type: 'video/avi', binary: true, canonical: 'avi', vsCodeLang: vsCodeLangBinary },
        'divx': { type: 'video/divx', binary: true, canonical: 'divx', vsCodeLang: vsCodeLangBinary },
        'flv': { type: 'video/x-flv', binary: true, canonical: 'flv', vsCodeLang: vsCodeLangBinary },
        'mkv': { type: 'video/x-matroska', binary: true, canonical: 'mkv', vsCodeLang: vsCodeLangBinary },
        'mov|qt': { type: 'video/quicktime', binary: true, canonical: 'mov', vsCodeLang: vsCodeLangBinary },
        'mp4|m4v': { type: 'video/mp4', binary: true, canonical: 'mp4', vsCodeLang: vsCodeLangBinary },
        'mpeg|mpg|mpe': { type: 'video/mpeg', binary: true, canonical: 'mpeg', vsCodeLang: vsCodeLangBinary },
        'ogv': { type: 'video/ogg', binary: true, canonical: 'ogv', vsCodeLang: vsCodeLangBinary },
        'webm': { type: 'video/webm', binary: true, canonical: 'webm', vsCodeLang: vsCodeLangBinary },
        'wm': { type: 'video/x-ms-wm', binary: true, canonical: 'wm', vsCodeLang: vsCodeLangBinary },
        'wmv': { type: 'video/x-ms-wmv', binary: true, canonical: 'wmv', vsCodeLang: vsCodeLangBinary },
        'wmx': { type: 'video/x-ms-wmx', binary: true, canonical: 'wmx', vsCodeLang: vsCodeLangBinary },
    },
    'Font': {
        'otf': { type: 'application/x-font-otf', binary: true, canonical: 'otf', vsCodeLang: vsCodeLangBinary },
        'ttf': { type: 'application/x-font-ttf', binary: true, canonical: 'ttf', vsCodeLang: vsCodeLangBinary },
        'woff|woff2': { type: 'application/x-font-woff', binary: true, canonical: 'woff', vsCodeLang: vsCodeLangBinary },
        'eot': { type: 'application/vnd.ms-fontobject', binary: true, canonical: 'eot', vsCodeLang: vsCodeLangBinary },
    },
    // Archives.

    'Archive': {
        'iso': { type: 'application/iso-image', binary: true, canonical: 'iso', vsCodeLang: vsCodeLangBinary },
        'dmg': { type: 'application/x-apple-diskimage', binary: true, canonical: 'dmg', vsCodeLang: vsCodeLangBinary },
        'tar': { type: 'application/x-tar', binary: true, canonical: 'tar', vsCodeLang: vsCodeLangBinary },
        'gtar': { type: 'application/x-gtar', binary: true, canonical: 'gtar', vsCodeLang: vsCodeLangBinary },
        'gz|tgz|gzip': { type: 'application/x-gzip', binary: true, canonical: 'gz', vsCodeLang: vsCodeLangBinary },
        'rar': { type: 'application/rar', binary: true, canonical: 'rar', vsCodeLang: vsCodeLangBinary },
        'zip': { type: 'application/zip', binary: true, canonical: 'zip', vsCodeLang: vsCodeLangBinary },
        '7z': { type: 'application/x-7z-compressed', binary: true, canonical: '7z', vsCodeLang: vsCodeLangBinary },
        'jar': { type: 'application/java-archive', binary: true, canonical: 'jar', vsCodeLang: vsCodeLangBinary },
        'node': { type: 'application/node-archive', binary: true, canonical: 'node', vsCodeLang: vsCodeLangBinary },
        'phar': { type: 'application/php-archive', binary: true, canonical: 'phar', vsCodeLang: vsCodeLangBinary },
    },
    // Certificates.

    'Certificate': {
        'csr': { type: 'text/plain', binary: false, canonical: 'csr', vsCodeLang: 'plaintext' },
        'crt': { type: 'text/plain', binary: false, canonical: 'crt', vsCodeLang: 'plaintext' },
        'pem': { type: 'text/plain', binary: false, canonical: 'pem', vsCodeLang: 'plaintext' },
        'asc': { type: 'text/plain', binary: false, canonical: 'asc', vsCodeLang: 'plaintext' },
    },
    // Applications.

    'Other Application': {
        'so': { type: mimeTypeStream, binary: true, canonical: 'so', vsCodeLang: vsCodeLangBinary },
        'app': { type: mimeTypeStream, binary: true, canonical: 'app', vsCodeLang: vsCodeLangBinary },
        'bin': { type: mimeTypeStream, binary: true, canonical: 'bin', vsCodeLang: vsCodeLangBinary },
        'com': { type: mimeTypeStream, binary: true, canonical: 'com', vsCodeLang: vsCodeLangBinary },
        'dll': { type: mimeTypeStream, binary: true, canonical: 'dll', vsCodeLang: vsCodeLangBinary },
        'exe': { type: 'application/x-msdownload', binary: true, canonical: 'exe', vsCodeLang: vsCodeLangBinary },
        'blend': { type: 'application/x-blender', binary: true, canonical: 'blend', vsCodeLang: vsCodeLangBinary },
        'sketch': { type: 'application/zip', binary: true, canonical: 'sketch', vsCodeLang: vsCodeLangBinary },
    },
    // Proprietary.

    'Google': {
        'kml': { type: 'application/vnd.google-earth.kml+xml', binary: false, canonical: 'kml', vsCodeLang: 'xml' },
        'kmz': { type: 'application/vnd.google-earth.kmz', binary: true, canonical: 'kmz', vsCodeLang: vsCodeLangBinary },
    },
    'Adobe': {
        'ps': { type: 'application/postscript', binary: true, canonical: 'ps', vsCodeLang: vsCodeLangBinary },
        'fla': { type: 'application/vnd.adobe.flash', binary: true, canonical: 'fla', vsCodeLang: vsCodeLangBinary },
        'swf': { type: 'application/x-shockwave-flash', binary: true, canonical: 'swf', vsCodeLang: vsCodeLangBinary },
    },
    'Apple': {
        'key': { type: 'application/vnd.apple.keynote', binary: true, canonical: 'key', vsCodeLang: vsCodeLangBinary },
        'numbers': { type: 'application/vnd.apple.numbers', binary: true, canonical: 'numbers', vsCodeLang: vsCodeLangBinary },
        'pages': { type: 'application/vnd.apple.pages', binary: true, canonical: 'pages', vsCodeLang: vsCodeLangBinary },
    },
    'MS Office': {
        'doc': { type: 'application/msword', binary: true, canonical: 'doc', vsCodeLang: vsCodeLangBinary },
        'docm': { type: 'application/vnd.ms-word.document.macroEnabled.12', binary: true, canonical: 'docm', vsCodeLang: vsCodeLangBinary },
        'docx': { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', binary: true, canonical: 'docx', vsCodeLang: vsCodeLangBinary },
        'dotm': { type: 'application/vnd.ms-word.template.macroEnabled.12', binary: true, canonical: 'dotm', vsCodeLang: vsCodeLangBinary },
        'dotx': { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', binary: true, canonical: 'dotx', vsCodeLang: vsCodeLangBinary },
        'mdb': { type: 'application/vnd.ms-access', binary: true, canonical: 'mdb', vsCodeLang: vsCodeLangBinary },
        'mpp': { type: 'application/vnd.ms-project', binary: true, canonical: 'mpp', vsCodeLang: vsCodeLangBinary },
        'one': { type: 'application/onenote', binary: true, canonical: 'one', vsCodeLang: vsCodeLangBinary },
        'onetoc|onetoc2': { type: 'application/onenote', binary: true, canonical: 'onetoc', vsCodeLang: vsCodeLangBinary },
        'onepkg': { type: 'application/onenote', binary: true, canonical: 'onepkg', vsCodeLang: vsCodeLangBinary },
        'oxps': { type: 'application/oxps', binary: true, canonical: 'oxps', vsCodeLang: vsCodeLangBinary },
        'ppt': { type: 'application/vnd.ms-powerpoint', binary: true, canonical: 'ppt', vsCodeLang: vsCodeLangBinary },
        'pps': { type: 'application/vnd.ms-powerpoint', binary: true, canonical: 'pps', vsCodeLang: vsCodeLangBinary },
        'potm': { type: 'application/vnd.ms-powerpoint.template.macroEnabled.12', binary: true, canonical: 'potm', vsCodeLang: vsCodeLangBinary },
        'potx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.template', binary: true, canonical: 'potx', vsCodeLang: vsCodeLangBinary },
        'ppam': { type: 'application/vnd.ms-powerpoint.addin.macroEnabled.12', binary: true, canonical: 'ppam', vsCodeLang: vsCodeLangBinary },
        'ppsm': { type: 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12', binary: true, canonical: 'ppsm', vsCodeLang: vsCodeLangBinary },
        'ppsx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', binary: true, canonical: 'ppsx', vsCodeLang: vsCodeLangBinary },
        'pptm': { type: 'application/vnd.ms-powerpoint.presentation.macroEnabled.12', binary: true, canonical: 'pptm', vsCodeLang: vsCodeLangBinary },
        'pptx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', binary: true, canonical: 'pptx', vsCodeLang: vsCodeLangBinary },
        'sldm': { type: 'application/vnd.ms-powerpoint.slide.macroEnabled.12', binary: true, canonical: 'sldm', vsCodeLang: vsCodeLangBinary },
        'sldx': { type: 'application/vnd.openxmlformats-officedocument.presentationml.slide', binary: true, canonical: 'sldx', vsCodeLang: vsCodeLangBinary },
        'wri': { type: 'application/vnd.ms-write', binary: true, canonical: 'wri', vsCodeLang: vsCodeLangBinary },
        'xla': { type: 'application/vnd.ms-excel', binary: true, canonical: 'xla', vsCodeLang: vsCodeLangBinary },
        'xls': { type: 'application/vnd.ms-excel', binary: true, canonical: 'xls', vsCodeLang: vsCodeLangBinary },
        'xlt': { type: 'application/vnd.ms-excel', binary: true, canonical: 'xlt', vsCodeLang: vsCodeLangBinary },
        'xlw': { type: 'application/vnd.ms-excel', binary: true, canonical: 'xlw', vsCodeLang: vsCodeLangBinary },
        'xlam': { type: 'application/vnd.ms-excel.addin.macroEnabled.12', binary: true, canonical: 'xlam', vsCodeLang: vsCodeLangBinary },
        'xlsb': { type: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12', binary: true, canonical: 'xlsb', vsCodeLang: vsCodeLangBinary },
        'xlsm': { type: 'application/vnd.ms-excel.sheet.macroEnabled.12', binary: true, canonical: 'xlsm', vsCodeLang: vsCodeLangBinary },
        'xlsx': { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', binary: true, canonical: 'xlsx', vsCodeLang: vsCodeLangBinary },
        'xltm': { type: 'application/vnd.ms-excel.template.macroEnabled.12', binary: true, canonical: 'xltm', vsCodeLang: vsCodeLangBinary },
        'xltx': { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template', binary: true, canonical: 'xltx', vsCodeLang: vsCodeLangBinary },
        'xps': { type: 'application/vnd.ms-xpsdocument', binary: true, canonical: 'xps', vsCodeLang: vsCodeLangBinary },
    },
    'OpenOffice': {
        'odb': { type: 'application/vnd.oasis.opendocument.database', binary: true, canonical: 'odb', vsCodeLang: vsCodeLangBinary },
        'odc': { type: 'application/vnd.oasis.opendocument.chart', binary: true, canonical: 'odc', vsCodeLang: vsCodeLangBinary },
        'odf': { type: 'application/vnd.oasis.opendocument.formula', binary: true, canonical: 'odf', vsCodeLang: vsCodeLangBinary },
        'odg': { type: 'application/vnd.oasis.opendocument.graphics', binary: true, canonical: 'odg', vsCodeLang: vsCodeLangBinary },
        'odp': { type: 'application/vnd.oasis.opendocument.presentation', binary: true, canonical: 'odp', vsCodeLang: vsCodeLangBinary },
        'ods': { type: 'application/vnd.oasis.opendocument.spreadsheet', binary: true, canonical: 'ods', vsCodeLang: vsCodeLangBinary },
        'odt': { type: 'application/vnd.oasis.opendocument.text', binary: true, canonical: 'odt', vsCodeLang: vsCodeLangBinary },
    },
    'WordPerfect': {
        'wpd|wp': { type: 'application/wordperfect', binary: true, canonical: 'wpd', vsCodeLang: vsCodeLangBinary },
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
