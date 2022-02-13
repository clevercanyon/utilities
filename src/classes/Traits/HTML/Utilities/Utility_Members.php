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
namespace Clever_Canyon\Utilities\Traits\HTML\Utilities;

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
 * @see   U\HTML
 */
trait Utility_Members {
	/**
	 * Checks if a string is HTML markup.
	 *
	 * @since 2022-02-12
	 *
	 * @param string $str String to test for markup.
	 *
	 * @return bool True if string is HTML markup.
	 */
	public static function is( string $str ) : bool {
		return false !== mb_stripos( $str, '</html>' )
			|| ( false !== mb_strpos( $str, '<' ) && preg_match( '/\<[^<>]+\>/u', $str ) )
			|| ( false !== mb_strpos( $str, '&' ) && preg_match( '/&#?[a-z0-9]+;/ui', $str ) );
	}

	/**
	 * Checks if markup starts with specific tag.
	 *
	 * @since 2022-02-12
	 *
	 * @param string       $markup Markup to check.
	 * @param string|array $tags   Tag(s) to consider.
	 *
	 * @return bool True if markup starts with one of the `$tags`.
	 */
	public static function starts_with_tag( string $markup, /* string|array */ $tags ) : bool {
		assert( is_string( $tags ) || is_array( $tags ) );

		$tags_regexp = array_map( [ U\Str::class, 'esc_reg' ], (array) $tags );
		$tags_regexp = implode( '|', $tags_regexp );

		return (bool) preg_match( '/^\<(?:' . $tags_regexp . ')(?:\s*\/|\s+[^<>]*)?\>/ui', $markup );
	}

	/**
	 * Checks if markup contains block tags.
	 *
	 * @since 2022-02-12
	 *
	 * @param string $markup Markup to check.
	 *
	 * @return bool True if markup contains block tags.
	 */
	public static function has_block_tags( string $markup ) : bool {
		return (bool) preg_match( '/\<(?:' . U\HTML::block_tags_regexp() . ')(?:\s*\/|\s+[^<>]*)?\>/ui', $markup );
	}

	/**
	 * Gets a regexp `|` fragment for HTML block tags.
	 *
	 * @since 2022-02-12
	 *
	 * @return string Regexp `|` fragment for HTML block tags.
	 *                e.g., `p|div|header|footer|...`, etc.
	 */
	public static function block_tags_regexp() : string {
		static $regexp; // Memoize.

		if ( null !== $regexp ) {
			return $regexp; // Saves time.
		}
		$block_tags = array_map( [ U\Str::class, 'esc_reg' ], U\HTML::BLOCK_TAGS );
		return $regexp = implode( '|', $block_tags );
	}
}
