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
namespace Clever_Canyon\Utilities\Traits\File\Utilities;

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
 * @see   U\File
 */
trait Content_Disposition_Members {
	/**
	 * Gets content disposition; suitable for `content-disposition:` header.
	 *
	 * @since 2022-01-19
	 *
	 * @param array $args Configuration of `content-disposition:` header.
	 *
	 *     bool   `attachment` It's a file attachment; i.e., download?
	 *                         Default is `true` if `inline` and `form_data` are `false`.
	 *                         `attachment`, `inline`, and `form_data` are mutually exclusive.
	 *
	 *     bool   `inline`     It's an inline file? Default is `false`.
	 *     bool   `form_data`  It's a header for a multipart body? Default is `false`.
	 *     ---
	 *     string `file_name`  File name when `inline` or `attachment` are `true`. Default is `null`.
	 *     string `charset`    Charset to use with `file_name`. Default is {@see U\Env::charset()}.
	 *
	 *                         * You should generally pass this explicitly based on what is being served to a user,
	 *                           and based on the charset used by the file. The current charset may or may not be accurate.
	 *
	 *                         * To explicitly force no charset to be added, set this to an empty string.
	 *
	 *     string `name`       Header name when `form_data` is `true`. Default is `null`.
	 *
	 * @return string Content disposition; suitable for `content-disposition:` header.
	 */
	public static function content_disposition( array $args ) : string {
		$args += [
			'attachment' => false,
			'inline'     => false,
			'form_data'  => false,

			'file_name' => null,
			'charset'   => null,
			'name'      => null,
		];
		// These three are mutually exclusive.
		$args[ 'attachment' ] = ! $args[ 'inline' ] && ! $args[ 'form_data' ];
		$args[ 'inline' ]     = ! $args[ 'attachment' ] && ! $args[ 'form_data' ];
		$args[ 'form_data' ]  = ! $args[ 'inline' ] && ! $args[ 'attachment' ];

		$disposition = ''; // Initialize.

		$disposition .= $args[ 'inline' ] ? '; inline' : '';
		$disposition .= $args[ 'attachment' ] ? '; attachment' : '';
		$disposition .= $args[ 'form_data' ] ? '; form-data' : '';

		$disposition .= $args[ 'form_data' ] && $args[ 'name' ] ? '; name="' . U\Str::esc_dq( $args[ 'name' ] ) . '"' : '';
		$disposition .= ( $args[ 'attachment' ] || $args[ 'inline' ] ) && $args[ 'file_name' ]
			? '; filename="' . U\Str::esc_dq( $args[ 'file_name' ] ) . '"' : '';

		if ( ( $args[ 'attachment' ] || $args[ 'inline' ] ) && $args[ 'file_name' ] && '' !== $args[ 'charset' ] ) {
			$disposition .= '; filename*=' . ( $args[ 'charset' ] ?: U\Env::charset() ) . '\'\'' . U\URL::encode( $args[ 'file_name' ] );
		}
		return trim( $disposition, ' ;' );
	}
}
