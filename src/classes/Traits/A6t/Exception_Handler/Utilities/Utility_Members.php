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
namespace Clever_Canyon\Utilities\Traits\A6t\Exception_Handler\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\Exception_Handler
 */
trait Utility_Members {
	/**
	 * Shutdown handler.
	 *
	 * @since 2022-03-03
	 *
	 * @throws \ErrorException Converts errors to exceptions.
	 *                         Only on errors that we're reporting.
	 *
	 * @see   U\A6t\Exception_Handler::on_error()
	 */
	public static function on_shutdown() : void {
		if ( $error = error_get_last() ) {
			static::on_error( $error[ 'type' ], $error[ 'message' ], $error[ 'file' ], $error[ 'line' ] );
		}
	}

	/**
	 * Error handler.
	 *
	 * @since 2022-03-03
	 *
	 * @param int    $type    Type; e.g., `E_ERROR`.
	 * @param string $message Textual error message.
	 * @param string $file    File error occurred in.
	 * @param int    $line    Line number error occured on.
	 *
	 * @return bool `false` when choosing not to handle the error.
	 *
	 * @throws \ErrorException Converts errors to exceptions.
	 *                         Only on errors that we're reporting.
	 *
	 * @see   U\A6t\Exception_Handler::on_exception()
	 */
	public static function on_error( int $type, string $message, string $file, int $line ) : bool {
		if ( ! ( error_reporting() & $type ) ) {
			return false; // Kick it back to PHP's error handler.

		} elseif ( in_array( $type, [ E_NOTICE, E_USER_NOTICE, E_DEPRECATED, E_USER_DEPRECATED ], true ) ) {
			return false; // Kick it back to PHP's error handler.
		}
		throw new \ErrorException( $message, 0, $type, $file, $line );
	}

	/**
	 * Exception handler.
	 *
	 * There is no way to stop the exception here.
	 * The only purpose of this function is to handle gracefully.
	 *
	 * @since 2022-03-03
	 *
	 * @param \Throwable $throwable Throwable.
	 */
	public static function on_exception( \Throwable $throwable ) : void {
		try {
			if ( ! headers_sent() ) {
				U\HTTP::response_status( 500 );

				U\HTTP::cache_control( [ // Don't cache exceptions.
					'disable_page_cache'     => true,
					'disable_object_cache'   => true,
					'disable_database_cache' => true,
				] );
				if ( ! ( $existing_cache_control_header = U\HTTP::response_header( 'cache-control' ) )
					|| ! preg_match( '/\b(?:private|no-cache|no-store)\b/ui', $existing_cache_control_header )
				) {
					U\HTTP::cache_control( [ // Do cache exceptions in the browser.
						// In the browser, cache error documents (for everyone) with a low TTL while awaiting recovery.
						// The goal (intention) is to have a short TTL in the browser so the site can recover quickly.
						// What we want to avoid is not caching error documents at all, resulting in tons of hits
						// at a time when there is already a problem with the site.

						'public'                 => true, // Yes, allow it to be cached.
						'must_revalidate'        => true, // Yes, must revalidate cache data.
						'max_age'                => 300,  // `300` = 5 minutes in the browser.
						's_maxage'               => 300,  // `300` = 5 minutes in the edge cache.
						// ^ Cloudflare’s minimum edge cache TTL is 2 hours for their free plan; {@see https://o5p.me/VHjnUQ}.
						'stale_while_revalidate' => 300,  // `300` = stale up to 5 minutes.
						'stale_if_error'         => 300,  // `300` = stale up to 5 minutes.
					] );
				}
				if ( $document_root = U\Env::var( 'DOCUMENT_ROOT' ) ) {
					if ( is_file( $_500_error_document = U\Dir::join( $document_root, '/500.shtml' ) ) ) {
						if ( U\HTTP::prep_for_output() ) {
							header( 'content-type: ' . U\File::content_type( $_500_error_document ) );
							readfile( $_500_error_document );
						}
					} elseif ( is_file( $_500_error_document = U\Dir::join( $document_root, '/500.html' ) ) ) {
						if ( U\HTTP::prep_for_output() ) {
							header( 'content-type: ' . U\File::content_type( $_500_error_document ) );
							readfile( $_500_error_document );
						}
					}
				}
			}
			U\HTTP::finish_request(); // Try to end request.

			// Maybe notify via Slack.

			static::maybe_slack_notify( $throwable );

		} catch ( \Throwable $throwable ) {
			// Fail softly.
		}
	}

	/**
	 * Posts a Slack notification (maybe).
	 *
	 * @since 2022-03-10
	 *
	 * @param \Throwable $throwable Throwable.
	 */
	protected static function maybe_slack_notify( \Throwable $throwable ) : void {
		if ( ! U\Env::static_var( 'C10N_SLACK_NOTIFY_ON_EXCEPTION' ) ) {
			return; // Not applicable.
		}
		U\Slack::notify(
			'*[' . static::class . ']: `' . U\URL::current_host() . '`*' . "\n" .
			'----------------------------------------------------------------------------------------------------' . "\n" .
			'```' . "\n" .
			'Type       : ' . static::exception_type( $throwable ) . "\n" .
			'Message    : ' . $throwable->getMessage() . "\n" .
			'URL        : ' . U\URL::current() . "\n\n" .
			'Stack Trace: ' . "\n" .
			$throwable->getTraceAsString() . "\n" .
			'```',
			[ 'emoji' => ':danger_icon:' ]
		);
	}

	/**
	 * Gets exception type.
	 *
	 * @since 2022-03-10
	 *
	 * @param \Throwable $throwable Throwable.
	 *
	 * @return string Error and/or exception type.
	 */
	protected static function exception_type( \Throwable $throwable ) : string {
		if ( $throwable instanceof \ErrorException ) {
			$error_severity = $throwable->getSeverity();
			$core_constants = get_defined_constants( true )[ 'Core' ];

			foreach ( $core_constants as $_name => $_code ) {
				if ( 0 === mb_strpos( $_name, 'E_' ) && $_code === $error_severity ) {
					return 'ErrorException::' . $_name;
				}
			}
		}
		return get_class( $throwable );
	}
}
