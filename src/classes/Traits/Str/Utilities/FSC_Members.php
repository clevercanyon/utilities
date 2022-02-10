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
namespace Clever_Canyon\Utilities\Traits\Str\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\Str
 */
trait FSC_Members {
	/**
	 * Checks fsc (filesystem component) validity; e.g., `my-fsc`, `.my-fsc`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid fsc.
	 *
	 * @see   https://linux.die.net/man/1/pathchk
	 * @see   https://en.wikipedia.org/wiki/Filename
	 */
	public static function is_fsc( string $str ) : bool {
		return U\Str::is_valid_helper( $str, 1, 128, '/^(?!.*(?:\.{2}|~{2}|_{2}|-{3})|.*\.$)[a-z0-9.~_][a-z0-9.~_\-]*$/u' );
	}

	/**
	 * Converts string to fsc (filesystem component); e.g., `my-fsc`, `.my-fsc`.
	 *
	 * POSIX: {@see https://linux.die.net/man/1/pathchk} utility.
	 * This follows POSIX (`pathchk`) recommendations, with a few exceptions:
	 *
	 * - Max length is `128` instead of `14`, which is waaaay too limiting.
	 *   EXT, EXT2, EXT3, EXT4, XFS, BTRFS, NTFS, HFS+, and APFS all allow `255`.
	 *   That covers all modern versions of Mac, Windows, and Linux flavors.
	 *
	 *   * It should be noted, however, that Windows continues to have a
	 *     `MAX_PATH` of just 256 bytes overall. Therefore, smaller components
	 *     are highly recommended to avoid hitting this rather annoying limitation.
	 *     Windows 10 introduces a new override; {@see https://o5p.me/E0K93t}.
	 *     With the new override enabled, paths can be up to ~32000 bytes.
	 *
	 *   * Max overall path length on other filesystems is ~32000 bytes.
	 *
	 * - Allowed characters include `~`, which POSIX does not allow.
	 *   Many systems use `~` to flag backup files, and all of the above
	 *   filesystems support this character, so not an issue to allow `~`.
	 *     - Full list of allowed chars: `[a-z0-9.~_\-]`.
	 *
	 * - This does not allow leading or trailing `.` dots, except that it does
	 *   obviously allow for dotfiles; i.e., files beginning with a single `.`.
	 *
	 * - Up to two consecutive `--` are allowed, but not more than two.
	 *   This accomodates punycode and some ridiculous dashed domain names.
	 *
	 * - This does not allow consecutive `..`, `~~`, or `__`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to fsc.
	 * @param bool   $strict Strict definition validations? Default is `true`.
	 *
	 *                       * Strict mode validates caSe and maximum of 128 bytes.
	 *                         Forced to all lowercase for consistency; less complexity.
	 *
	 *                       * Loose mode does not enforce lowercase conversion.
	 *                         Loose mode allows up to 255 bytes in length, which is also
	 *                         the absolute maximum length of {@see U\Str::to_slug()}.
	 *
	 *                       * In both modes, fscs exceeding max length in bytes
	 *                         get converted into a 64-byte {@see U\Crypto::x_sha()}.
	 *
	 * @return string String converted to fsc. Always 1...255 bytes in length.
	 *                In strict (default) mode, always 1...128 bytes in length.
	 *
	 *                * Except, if `$str` given is zero-length, no conversion is done.
	 *                  In which case the return value of this method will be an empty string.
	 *
	 * @see   https://linux.die.net/man/1/pathchk
	 * @see   https://en.wikipedia.org/wiki/Filename
	 * @see   https://en.wikipedia.org/wiki/Comparison_of_file_systems
	 */
	public static function to_fsc( string $str, bool $strict = true ) : string {
		if ( '' === $str ) {
			return $str; // Don't modify.
		}
		$fsc = $str; // Working copy.

		// In case of already being an fsc.

		if ( U\Str::is_fsc( $fsc ) ) {
			return $fsc; // Saves time.
		}
		// Trim whitespace.

		$fsc = trim( $fsc );

		// Preserve leading `.` in hidden files.

		if ( $is_dotfile = '.' === $fsc[ 0 ] ) {
			$fsc = mb_substr( $fsc, 1 );
		}
		// Convert international chars to ASCII.

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$fsc = U\Str::to_ascii_er( $fsc );
		} else { // Replace non-ASCII alphanumerics with `x`.
			$fsc = preg_replace( '/(?![a-z0-9])[\p{L}\p{N}]/ui', 'x', $fsc );
		}
		// In strict mode, force lowercase for consistency.
		// Some systems are not caSe-sensitive while other systems are caSe-sensitive.
		// The goal here is simply to improve consistency so there's less complexity.

		if ( $strict ) {
			$fsc = mb_strtolower( $fsc );
		}
		// Replace some non-POSIX-compliant characters with dots `.`.
		// Replace remaining non-POSIX-compliant characters with hyphens `-`.
		// Note: `~` is an additional allowed char here. See method comments.

		$fsc = preg_replace( '/[#@:\\\\\/]+/ui', '.', $fsc );
		$fsc = preg_replace( '/[^a-z0-9.~_\-]+/ui', '-', $fsc );

		// Reduce consecutive `.`, `~`, `_` into just one.
		// There can be up to two consecutive `--` to accomodate domains.
		// Careful to replace `..` in a way that doesn't mangle file extensions.

		$fsc = preg_replace( '/([.~_])\1{1,}/u', '${1}', $fsc );
		$fsc = preg_replace( '/(-)\1{2,}/u', '${1}${1}', $fsc );

		// Replace leading and trailing dots with underscores.
		// `pathchk` utility doesn't catch these, but it's wrong, regardless.

		if ( false !== mb_strpos( $fsc, '.' ) ) {
			$fsc = preg_replace_callback(
				'/(^\.+|\.+$)/u',
				fn( $m ) => str_repeat( '_', mb_strlen( $m[ 1 ] ) ),
				$fsc
			);
		}
		// Replace leading hyphens only if it's not a dotfile.
		// Confirmed using `pathchk`; a leading `.-` passes POSIX compliance.
		// Main reason to avoid a leading `-` is so an fsc can be passed as a CLI arg;
		// Otherwise, it's seen as a CLI switch; e.g., `$ pathchk '-foo-bar'` fails miserably.

		if ( ! $is_dotfile && '-' === $fsc[ 0 ] ) {
			$fsc = preg_replace_callback(
				'/^(-+)/u',
				fn( $m ) => str_repeat( '_', mb_strlen( $m[ 1 ] ) ),
				$fsc
			);
		}
		// Suffix reserved words with an `x`.
		// Must check basename and full fsc also.
		// In loose mode, some caSe juggling is necessary.

		if ( $ext = U\File::ext( $fsc ) ) {
			$basename = basename( $fsc, '.' . $ext );

			if ( in_array( $strict ? $basename : mb_strtolower( $basename ), U\Fs::RESERVED_FSCS, true )
				|| in_array( $strict ? $fsc : mb_strtolower( $fsc ), U\Fs::RESERVED_FSCS, true ) ) {
				$fsc = $basename . 'x.' . $ext;
			}
		} elseif ( in_array( $strict ? $fsc : mb_strtolower( $fsc ), U\Fs::RESERVED_FSCS, true ) ) {
			$fsc .= 'x'; // Suffix.
		}
		// Must be at least 1 byte in length; not counting a leading `.`.
		// In strict mode, must not be more than 128 bytes in length; counting a leading `.`.
		// In loose mode, must not be more than 255 bytes in length; counting a leading `.`.

		if ( ( $bytes = strlen( $fsc ) ) < 1 ) {
			$fsc .= 'x'; // e.g., `x`, `.x`.
		} elseif ( ( ( $is_dotfile ? 1 : 0 ) + $bytes ) > ( $strict ? 128 : 255 ) ) {
			$fsc = U\Crypto::x_sha( trim( $str ), $is_dotfile ? 63 : 64 ); // Hash the original string.
		}
		// Restore a possible leading `.`.

		return $is_dotfile ? '.' . $fsc : $fsc;
	}
}
