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
	 * Static instance.
	 *
	 * @since 2022-01-22
	 */
	protected static U\Mem $instance;

	/**
	 * Gets alive instance (`memcached` extension required).
	 *
	 * @since 2022-01-22
	 *
	 * @param bool $check_ext Check extension exists? Default is `false`.
	 *
	 *                        The reason for a `false` default is that by convention (i.e., `_er` = extension required)
	 *                        a caller is expected to have already worked this out and considered other alternatives
	 *                        in case the extension is unavailable. That is the recommended best practice.
	 *
	 *                        Therefore, when the extension is unavailable, it's desirable that an exception
	 *                        be thrown due to bad practice instead of hiding the issue here. That said, this flag exists
	 *                        for easier testing and for cases when a caller wants to enable explicitly.
	 *
	 * @return U\Mem|null Instance of {@see U\Mem}, else `null` on failure.
	 */
	public static function instance_alive_er( bool $check_ext = false ) /* : U\Mem|null */ : ?U\Mem {
		if ( $check_ext && ! U\Env::can_use_extension( 'memcached' ) ) {
			return null; // Not possible.
		}
		if ( ! isset( U\Mem::$instance ) ) {
			U\Mem::$instance = new U\Mem();
		}
		return U\Mem::$instance->is_alive() ? U\Mem::$instance : null;
	}

	/**
	 * Gets|sets in-memory (ideally-persistent) cache.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|array $primary_key_parts A single key part or a bundle containing multiple key parts.
	 *                                        These are key parts used to formulate an actual cache key identifier.
	 *
	 *                                        Whatever you pass, it will be serialized & hashed; i.e., converted to a string key.
	 *                                        Passing `__METHOD__` or a group identifier is a highly recommended best practice.
	 *                                        By default, the cache is very broad in scope; i.e., not pkg|object-specific.
	 *
	 *                                        In WordPress, it may often be desirable to pass a plugin slug and/or blog ID as one of the parts.
	 *                                        Cached values are stored in a network-wide bucket in WordPress. For example, if there's anything
	 *                                        blog-specific about what is being cached, a blog ID should be given as one of the parts.
	 *
	 *                                        * The more parts you pass, the longer it will take to hash.
	 *                                          When passing a bundle, try to keep it simple for best performance.
	 *
	 *                                        * PHP does not allow a {@see \Closure} to be serialized whatsoever.
	 *                                          Do not pass closures as a key part; either directly or indirectly.
	 *                                          You can, however, pass a {@see U\Code_Stream_Closure}.
	 *
	 *                                        * PHP serializes a resource as `0`, and therefore works, but it's a bad practice.
	 *                                          Do not pass resource values as a key part; either directly or indirectly.
	 *                                          Future versions of PHP will likely disallow altogether.
	 *
	 * @param string|array $sub_key_parts     Sub-key parts. Note: `$primary_key_parts` are used to establish a cache group;
	 *                                        while `$sub_key_parts` are used to identify specific items within that primary group.
	 *
	 *                                        The format and options for `$sub_key_parts` is exactly the same as for `$primary_key_parts`.
	 *                                        However, passing `__METHOD__` or a group identifier is *not* a best practice for `$sub_key_parts`.
	 *
	 * @param mixed        $value             Value to cache; i.e., when setting|updating the cache.
	 *                                        If not passed, this function simply operates as a getter.
	 *
	 *                                        * Passing `null` explicitly will {@see unset()} a given cache key.
	 *
	 *                                        * PHP does not allow a {@see \Closure} to be serialized whatsoever.
	 *                                          Do not attempt to cache closures here; either directly or indirectly.
	 *                                          The `igbinary` extension is no exception. It throws an exception if you try.
	 *                                          You can, however, cache a {@see U\Code_Stream_Closure}.
	 *
	 *                                        * PHP serializes a resource as `0`, and therefore works, but it's a bad practice.
	 *                                          Do not attempt to cache resource values here; either directly or indirectly.
	 *                                          Future versions of PHP will likely disallow altogether.
	 *
	 *                                        * The `igbinary` extension will issue a notice on resources and serialize as `null`.
	 *                                          Do not attempt to cache resource values here; either directly or indirectly.
	 *                                          Future versions of PHP will likely disallow altogether.
	 *
	 *                                        * If you must cache a resource, consider {@see U\A6t\Base::cls_cache()}.
	 *
	 * @param int          $expires_in        Default is {@see U\Time::HOUR_IN_SECONDS} (one hour).
	 *                                        Must be `> 0`, else it reverts to default {@see U\Time::HOUR_IN_SECONDS}.
	 *
	 * @return mixed Two different operation modes:
	 *               1. If `$value` is given, it's a write operation returning `true` on success; else `false` on failure.
	 *               2. If `$value` is not given, it's a read operation returning cached value, else `null` on miss or failure.
	 *
	 * @throws U\Fatal_Exception In debug mode; on Memcached failure.
	 */
	public static function cache(
		/* string|array */ $primary_key_parts,
		/* string|array */ $sub_key_parts,
		/* mixed */ $value = U\Func::PARAM_DEFAULT_NULL,
		int $expires_in = U\Time::HOUR_IN_SECONDS
	) /* : mixed */ {
		assert( ! is_resource( $primary_key_parts ) );
		assert( ! $primary_key_parts instanceof \Closure );

		assert( ! is_resource( $sub_key_parts ) );
		assert( ! $sub_key_parts instanceof \Closure );

		assert( ! is_resource( $value ) );
		assert( ! $value instanceof \Closure );

		assert( $expires_in > 0 );

		static $is_wordpress; // Memoize.
		$is_wordpress ??= U\Env::is_wordpress();

		$is_write_op = U\Func::PARAM_DEFAULT_NULL !== $value;
		$expires_in  = $expires_in <= 0 ? U\Time::HOUR_IN_SECONDS : $expires_in;

		// WordPress API compatibility.

		if ( $is_wordpress ) {
			static $wp_namespace_prefix; // Memoize.

			if ( null === $wp_namespace_prefix ) {
				/** Must match {@see U\Mem::$namespace}. */
				$wp_namespace_prefix = U\Pkg::namespace_crux();
				$wp_namespace_prefix .= '\\' . U\Pkg::data_context();
				$wp_namespace_prefix .= '\\' . U\Env::static_var( 'MEMCACHED_NAMESPACE_SALT' );
				$wp_namespace_prefix = U\Crypto::x_sha( $wp_namespace_prefix, 32 ) . '_';
			}
			// Max total key length     = 172 characters; {@see set_transient()}.
			// Max total key length     = 167 characters; {@see set_site_transient()}.

			// `$wp_namespace_prefix`   = 33 characters.
			// `$wp_primary_key_prefix` = 41 characters.
			// `$wp_sub_key`            = 40 characters.
			// Total length             = 114 characters (well within limits).

			$wp_primary_key_prefix = U\Crypto::sha1_key( $primary_key_parts ) . '_';
			$wp_sub_key            = U\Crypto::sha1_key( $sub_key_parts );
			$wp_transient_key      = $wp_namespace_prefix . $wp_primary_key_prefix . $wp_sub_key;

			if ( $is_write_op ) {
				if ( null === $value ) {
					delete_site_transient( $wp_transient_key );
					return true; // Indicate success even if it doesn't exist — it's gone.
				} else {
					set_site_transient( $wp_transient_key, U\Str::serialize( $value ), $expires_in );
					return true; // Indicate success even if value didn't change — it's up-to-date.
				}
			} else {
				$wp_transient_value = get_site_transient( $wp_transient_key );
				return false === $wp_transient_value ? null : U\Str::maybe_unserialize( $wp_transient_value );
			}
		}
		// Memcached API compatibility.

		static $can_use_mem_extension, $mem; // Memoize.

		if ( null === $can_use_mem_extension || null === $mem ) {
			$can_use_mem_extension ??= U\Env::can_use_extension( 'memcached' );
			$mem                   ??= $can_use_mem_extension ? ( U\Mem::instance_alive_er() ?: false ) : false;
		}
		if ( $mem ) { // No reason to calculate if Memcached not alive.

			// Default max primary key length = 217 bytes; {@see U\Mem::set()}.
			// Default max sub-key length     = 217 bytes; {@see U\Mem::set()}.

			// `$primary_key`                 = 40 bytes (well within limit).
			// `$sub_key`                     = 40 bytes (well within limit).

			$primary_key = U\Crypto::sha1_key( $primary_key_parts );
			$wp_sub_key  = U\Crypto::sha1_key( $sub_key_parts );

			if ( $is_write_op ) {
				try { // On failure, fall through to static CLS cache fallback.
					if ( $mem->set( $primary_key, $wp_sub_key, $value, $expires_in ) ) {
						return true; // Indicates in-memory cache success.
					}
				} catch ( U\Exception $exception ) {
					if ( U\Env::in_debug_mode() ) {
						throw new U\Fatal_Exception( $exception->getMessage() );
					}
				}
			} else {
				try { // On failure, fall through to static CLS cache fallback.
					if ( null !== ( $rtn_value = $mem->get( $primary_key, $wp_sub_key ) ) ) {
						return $rtn_value; // Success; return in-memory cache value.
					}
				} catch ( U\Exception $exception ) {
					if ( U\Env::in_debug_mode() ) {
						throw new U\Fatal_Exception( $exception->getMessage() );
					}
				}
			}
		}
		// Static CLS cache fallback.

		static $static_cls_namespace; // Memoize.

		if ( null === $static_cls_namespace ) {
			/** Must match {@see U\Mem::$namespace}. */
			$static_cls_namespace = U\Pkg::namespace_crux();
			$static_cls_namespace .= '\\' . U\Pkg::data_context();
			$static_cls_namespace .= '\\' . U\Env::static_var( 'MEMCACHED_NAMESPACE_SALT' );
			$static_cls_namespace .= '\\' . __FUNCTION__;
			$static_cls_namespace = U\Crypto::x_sha( $static_cls_namespace, 32 );
		}
		$static_cls_cache_key_parts = [ $static_cls_namespace, $primary_key_parts, $sub_key_parts ];

		if ( $is_write_op ) {
			static::cls_cache( $static_cls_cache_key_parts, $value );
			return true; // Indicates in-memory cache success.
		} else {
			return static::cls_cache( $static_cls_cache_key_parts );
		}
	}
}
