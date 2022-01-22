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
trait JSON_Encode_Decode_Members {
	/**
	 * JSON-encodes data.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed     $data         Data to JSON-encode.
	 * @param bool|null $pretty_print Pretty print? Default is `null`, which equates to `true`. Let's make JSON editing easy.
	 *                                This enables `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT`.
	 *
	 * @return string JSON-encoded string.
	 *
	 * @see   U\Str::json_decode()
	 */
	public static function json_encode( /* mixed */ $data, /* bool|null */ ?bool $pretty_print = null ) : string {
		$pretty_print ??= true; // For callers who prefer to depend on default here.
		$flags        = $pretty_print ? JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT : 0;

		if ( is_resource( $data ) ) {
			$data = (string) $data; // JSON-encoded below.
		}
		if ( U\Env::is_wordpress() ) {
			return wp_json_encode( $data, $flags );
		}
		return json_encode( $data, $flags );
	}

	/**
	 * JSON-decodes data.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $data    Data to JSON-decode.
	 * @param mixed  ...$args {@see json_decode()}.
	 *
	 * @return mixed JSON-decoded data.
	 *
	 * @see   U\Str::json_encode()
	 */
	public static function json_decode( string $data, ...$args ) /* : mixed */ {
		return json_decode( $data, ...$args );
	}
}
