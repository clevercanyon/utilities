<?php
/**
 * Clever Canyon™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Strict types, namespace, use statements, and other headers.">

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * File utilities.
 *
 * @since 2021-12-15
 */
final class File extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\File\Members;

	/**
	 * 1kb in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const KB_IN_BYTES = 1024;

	/**
	 * 1MB in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const MB_IN_BYTES = 1024 * U\File::KB_IN_BYTES;

	/**
	 * 1GB in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const GB_IN_BYTES = 1024 * U\File::MB_IN_BYTES;

	/**
	 * 1TB in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const TB_IN_BYTES = 1024 * U\File::GB_IN_BYTES;

	/**
	 * 1PB in bytes.
	 *
	 * @since 2021-12-15
	 */
	public const PB_IN_BYTES = 1024 * U\File::TB_IN_BYTES;

	/**
	 * MIME types by file extension.
	 *
	 * Definitely not an exhaustive list, but this covers everything that's
	 * used by WordPress, by CMS's in general, by Clever Canyon LLC, by WP Groove,
	 * in web design, and by the programming languages typically used in web design.
	 *   ... Plus a few other things.
	 *
	 * Level 1 array keys are MIME ext. type titles; {@see U\File::ext_type()}.
	 * Level 2 array keys are pipe-delimited extensions; {@see U\File::ext()}.
	 * Level 2 array values are MIME types; {@see U\File::mime_type()}, {@see U\File::content_type()}.
	 *
	 * @since 2021-12-15
	 *
	 * @see   https://o5p.me/Sr7Yjz
	 * @see   https://o5p.me/R9zN3r
	 */
	public const MIME_TYPES = [
		// Image formats.

		'Image' => [
			'ai'           => 'image/vnd.adobe.illustrator',
			'apng'         => 'image/apng',
			'bmp'          => 'image/bmp',
			'eps'          => 'image/eps',
			'gif'          => 'image/gif',
			'heic'         => 'image/heic',
			'ico'          => 'image/x-icon',
			'jpg|jpeg|jpe' => 'image/jpeg',
			'pict'         => 'image/pict',
			'png'          => 'image/png',
			'psd'          => 'image/vnd.adobe.photoshop',
			'pspimage'     => 'image/vnd.corel.psp',
			'svg|svgz'     => 'image/svg+xml',
			'tiff|tif'     => 'image/tiff',
			'webp'         => 'image/webp',
		],
		// Audio formats.

		'Audio' => [
			'aac'         => 'audio/aac',
			'flac'        => 'audio/flac',
			'mid|midi'    => 'audio/midi',
			'mka'         => 'audio/x-matroska',
			'mp3|m4a|m4b' => 'audio/mpeg',
			'ogg|oga'     => 'audio/ogg',
			'pls'         => 'audio/x-scpls',
			'ra|ram'      => 'audio/x-realaudio',
			'wav'         => 'audio/wav',
			'wax'         => 'audio/x-ms-wax',
			'wma'         => 'audio/x-ms-wma',
		],
		// Video formats.

		'Video' => [
			'3g2|3gp2'     => 'video/3gpp2', // Can also be audio.
			'3gp|3gpp'     => 'video/3gpp',  // Can also be audio.
			'asf|asx'      => 'video/x-ms-asf',
			'avi'          => 'video/avi',
			'divx'         => 'video/divx',
			'flv'          => 'video/x-flv',
			'mkv'          => 'video/x-matroska',
			'mov|qt'       => 'video/quicktime',
			'mp4|m4v'      => 'video/mp4',
			'mpeg|mpg|mpe' => 'video/mpeg',
			'ogv'          => 'video/ogg',
			'webm'         => 'video/webm',
			'wm'           => 'video/x-ms-wm',
			'wmv'          => 'video/x-ms-wmv',
			'wmx'          => 'video/x-ms-wmx',
		],
		// Font formats.

		'Font' => [
			'eot'   => 'application/vnd.ms-fontobject',
			'otf'   => 'application/x-font-otf',
			'ttf'   => 'application/x-font-ttf',
			'woff'  => 'application/x-font-woff',
			'woff2' => 'application/x-font-woff',
		],
		// PHP formats.

		'PHP' => [
			'php|phtm|phtml' => 'text/html',
			'phar'           => 'application/php-archive',
			'phps'           => 'application/x-php-source',
		],
		// HTML formats.

		'HTML' => [
			'htm|html|shtm|shtml' => 'text/html',
		],
		// Feed formats.

		'Feed' => [
			'atom'     => 'application/atom+xml',
			'rdf'      => 'application/rdf+xml',
			'rss-http' => 'text/xml',
			'rss|rss2' => 'application/rss+xml',
		],
		// Misc. XML formats.

		'XML' => [
			'dtd'        => 'application/xml-dtd',
			'xhtm|xhtml' => 'application/xhtml+xml',
			'xml'        => 'text/xml',
		],
		// Stylesheet formats.

		'Style' => [
			'css|scss' => 'text/css',
			'xsd'      => 'application/xsd+xml',
			'xsl|xslt' => 'application/xslt+xml',
		],
		// JSON formats.

		'JSON' => [
			'json|json5' => 'application/json',
			'jsonld'     => 'application/ld+json',
		],
		// JavaScript formats.

		'JavaScript' => [
			'js|ejs|cjs|mjs|jsx|ts|ets|cts|mts|tsx' => 'application/javascript',
		],
		// Misc. code formats.

		'Code' => [
			'asp|aspx'            => 'text/html',
			'bat'                 => 'application/octet-stream',
			'cgi|pl|plx|ppl|perl' => 'text/html',
			'class'               => 'application/java',
			'hta'                 => 'application/hta',
			'htc'                 => 'text/x-component',
			'sh|bash|zsh'         => 'application/octet-stream',
			'sql|sqlite'          => 'text/plain',
		],
		// Delimited file formats.

		'Delimited' => [
			'csv' => 'text/csv',
			'tsv' => 'text/tab-separated-values',
		],
		// Misc. log file formats.

		'Log' => [
			'log' => 'text/plain',
		],
		// Misc. config file formats.

		'Configuration' => [
			'htaccess|htpasswd'          => 'text/plain',
			'ini|cfg|conf|yaml|yml|toml' => 'text/plain',
		],
		// Translation file formats.

		'I18n' => [
			'mo' => 'application/x-gettext-translation',
			'po' => 'text/x-gettext-translation', // `pot` taken; use `po`.
		],
		// Misc. document formats.

		'Document' => [
			'pdf' => 'application/pdf',
			'rtf' => 'application/rtf',
			'rtx' => 'text/richtext',
		],
		// Misc. calendar formats.

		'Calendar' => [
			'ics' => 'text/calendar',
		],
		// Misc. text formats.

		'Text' => [
			'asc|c|cc|h|srt' => 'text/plain',
			'tmpl|tpl'       => 'text/plain',
			'txt|md'         => 'text/plain',
			'vtt'            => 'text/vtt',
		],
		// Archive formats.

		'Archive' => [
			'7z'          => 'application/x-7z-compressed',
			'dmg'         => 'application/x-apple-diskimage',
			'gtar'        => 'application/x-gtar',
			'gz|tgz|gzip' => 'application/x-gzip',
			'iso'         => 'application/iso-image',
			'jar'         => 'application/java-archive',
			'rar'         => 'application/rar',
			'tar'         => 'application/x-tar',
			'zip|sketch'  => 'application/zip',
		],
		// Application formats.

		'Application' => [
			'app|xcf' => 'application/octet-stream',
			'bin'     => 'application/octet-stream',
			'com'     => 'application/octet-stream',
			'dfxp'    => 'application/ttaf+xml',
			'dll'     => 'application/octet-stream',
			'exe'     => 'application/x-msdownload',
			'so'      => 'application/octet-stream',
			'blend'   => 'application/x-blender',
		],
		// Proprietary Adobe formats.

		'Adobe' => [
			'ps'  => 'application/postscript',
			'fla' => 'application/vnd.adobe.flash',
			'swf' => 'application/x-shockwave-flash',
		],

		// Proprietary: MS Office formats.

		'MS Office' => [
			'doc'                          => 'application/msword',
			'docm'                         => 'application/vnd.ms-word.document.macroEnabled.12',
			'docx'                         => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'dotm'                         => 'application/vnd.ms-word.template.macroEnabled.12',
			'dotx'                         => 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
			'mdb'                          => 'application/vnd.ms-access',
			'mpp'                          => 'application/vnd.ms-project',
			'onetoc|onetoc2|onetmp|onepkg' => 'application/onenote',
			'oxps'                         => 'application/oxps',
			'potm'                         => 'application/vnd.ms-powerpoint.template.macroEnabled.12',
			'potx'                         => 'application/vnd.openxmlformats-officedocument.presentationml.template',
			'pot|pps|ppt'                  => 'application/vnd.ms-powerpoint',
			'ppam'                         => 'application/vnd.ms-powerpoint.addin.macroEnabled.12',
			'ppsm'                         => 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
			'ppsx'                         => 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
			'pptm'                         => 'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
			'pptx'                         => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'sldm'                         => 'application/vnd.ms-powerpoint.slide.macroEnabled.12',
			'sldx'                         => 'application/vnd.openxmlformats-officedocument.presentationml.slide',
			'wri'                          => 'application/vnd.ms-write',
			'xlam'                         => 'application/vnd.ms-excel.addin.macroEnabled.12',
			'xla|xls|xlt|xlw'              => 'application/vnd.ms-excel',
			'xlsb'                         => 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
			'xlsm'                         => 'application/vnd.ms-excel.sheet.macroEnabled.12',
			'xlsx'                         => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'xltm'                         => 'application/vnd.ms-excel.template.macroEnabled.12',
			'xltx'                         => 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
			'xps'                          => 'application/vnd.ms-xpsdocument',
		],
		// Proprietary: OpenOffice formats.

		'OpenOffice' => [
			'odb' => 'application/vnd.oasis.opendocument.database',
			'odc' => 'application/vnd.oasis.opendocument.chart',
			'odf' => 'application/vnd.oasis.opendocument.formula',
			'odg' => 'application/vnd.oasis.opendocument.graphics',
			'odp' => 'application/vnd.oasis.opendocument.presentation',
			'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
			'odt' => 'application/vnd.oasis.opendocument.text',
		],
		// Proprietary: WordPerfect formats.

		'WordPerfect' => [
			'wp|wpd' => 'application/wordperfect',
		],
		// Proprietary: iWork formats.

		'iWork' => [
			'key'     => 'application/vnd.apple.keynote',
			'numbers' => 'application/vnd.apple.numbers',
			'pages'   => 'application/vnd.apple.pages',
		],
	];
}
