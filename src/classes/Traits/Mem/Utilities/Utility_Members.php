<?php
/**
 * CLEVER CANYON™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Strict types, namespace, use statements, and other headers.">

/**
 * Lint configuration.
 *
 * @since        2021-12-25
 *
 * @noinspection PhpComposerExtensionStubsInspection
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\Mem\Utilities;

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
 * @see   U\Mem
 */
trait Utility_Members {
	/**
	 * Gets|sets in-memory cache.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|array $primary_key_parts A single string part, or an array containing multiple parts.
	 *                                        These are key part(s) used to formulate an actual cache key identifier.
	 *
	 *                                        Whatever you pass, it will be hashed; i.e., converted to a string key.
	 *                                        Passing `__METHOD__` as one part is a highly recommended best practice.
	 *
	 *                                        Embedding objects or resources in a key parts array is not recommended.
	 *                                        It works, just know they'll be identified by ID via {@see U\Arr::hash()}.
	 *
	 *                                        * The more parts you pass, the longer it will take to hash.
	 *                                        It is recommended that you pass a string for best performance.
	 *                                        When passing an array, try to keep it simple for best performance.
	 *
	 * @param string|array $sub_key_parts     Sub-key parts. Note: `$primary_key_parts` are used to establish a cache group;
	 *                                        while `$sub_key_parts` are used to identify specific items within that primary group.
	 *
	 *                                        The format and options for `$sub_key_parts` is exactly the same as for `$primary_key_parts`.
	 *                                        However, passing `__METHOD__` is generally *not* a recommended best practice for `$sub_key_parts`.
	 *
	 * @param mixed        $value             Value to cache; i.e., when setting|updating the cache.
	 *                                        If not passed, this function simply operates as a getter.
	 *                                        Passing `null` explicitly will {@see unset()} a given cache key.
	 *
	 * @param int          $expires_in        Default is `0`. {@see U\Mem::set()} for further details.
	 *
	 * @return mixed If `$value` is given it's a write operation returning `true` on success, `false` on failure.
	 *               If `$value` is not given, it's a read operation. Returns mixed cache value — default value being `null`.
	 */
	public static function cache(
		/* string|array */ $primary_key_parts,
		/* string|array */ $sub_key_parts,
		/* mixed */ $value = U\Func::PARAM_DEFAULT_NULL,
		int $expires_in = 0
	) /* : mixed */ {
		assert( is_string( $primary_key_parts ) || is_array( $primary_key_parts ) );
		assert( is_string( $sub_key_parts ) || is_array( $sub_key_parts ) );

		static $can_use_mem_extension, $mem; // Remember.
		$can_use_mem_extension ??= U\Env::can_use_extension( 'memcached' );

		$is_write_op          = U\Func::PARAM_DEFAULT_NULL !== $value;
		$static_cls_key_parts = [ __FUNCTION__, $primary_key_parts, $sub_key_parts ];

		if ( ! $can_use_mem_extension ) {
			if ( $is_write_op ) {
				static::cls_cache( $static_cls_key_parts, $value );
				return false; // Indicates in-memory cache failure.
			} else {
				return static::cls_cache( $static_cls_key_parts );
			}
		}
		$primary_key = is_array( $primary_key_parts ) ? U\Arr::hash( $primary_key_parts ) : sha1( $primary_key_parts );
		$sub_key     = is_array( $sub_key_parts ) ? U\Arr::hash( $sub_key_parts ) : sha1( $sub_key_parts );

		$mem ??= U\Mem::instance_er(); // @todo Add method that can check if Memcache is running, catch exceptions, etc.

		if ( $is_write_op ) {
			if ( $mem->set( $primary_key, $sub_key, $value, $expires_in ) ) {
				static::cls_cache( $static_cls_key_parts, null );   // Clear any prior failures from static CLS cache.
				return true;                                        // Indicates in-memory cache success.
			} else {
				static::cls_cache( $static_cls_key_parts, $value ); // Fall back on static CLS cache.
				return false;                                       // Indicates in-memory cache failure.
			}
		} else {
			if ( null !== ( $mem_value = $mem->get( $primary_key, $sub_key ) ) ) {
				return $mem_value; // Success; return in-memory cache value.
			} else {
				return static::cls_cache( $static_cls_key_parts );  // Fall back on static CLS cache.
			}
		}
	}
}
