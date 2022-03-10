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
				http_response_code( 500 ); // Internal server error (500).

				U\HTTP::cache_control( [
					'disable_page_cache'     => true, // Always disable on exception.
					'disable_object_cache'   => true, // Always disable on exception.
					'disable_database_cache' => true, // Always disable on exception.
				] );
				if ( ! ( $existing_cache_control_header = U\HTTP::already_set_header( 'cache-control' ) )
					|| ! preg_match( '/\b(?:private|no-cache|no-store)\b/ui', $existing_cache_control_header ) ) {
					U\HTTP::cache_control( [
						// In the browser, cache error documents (for everyone) with a low TTL while awaiting recovery.
						// The goal (intention) is to have a short TTL in the browser so the site can recover quickly.
						// What we want to avoid is not caching error documents at all, then getting tons of hits
						// at a time when there is already a problem with the site.

						'public'                 => true, // Yes, allow it to be cached.
						'must_revalidate'        => true, // Yes, must revalidate cache data.
						'max_age'                => 300,  // `300` = 5 minutes in the browser.
						's_maxage'               => 7200, // `7200` = 2 hours in the edge cache.
						'stale_while_revalidate' => 300,  // `300` = stale up to 5 minutes.
						'stale_if_error'         => 300,  // `300` = stale up to 5 minutes.
					] );
				}
				U\HTTP::disable_robots(); // Don't index exceptions.

				if ( $document_root = U\Env::var( 'DOCUMENT_ROOT' ) ) {
					if ( is_file( $_500_error_document = U\Dir::join( $document_root, '/500.shtml' ) ) ) {
						if ( U\HTTP::prep_for_output() ) {
							readfile( $_500_error_document );
						}
					} elseif ( is_file( $_500_error_document = U\Dir::join( $document_root, '/500.html' ) ) ) {
						if ( U\HTTP::prep_for_output() ) {
							readfile( $_500_error_document );
						}
					}
				}
			}
			U\HTTP::finish_request(); // Try to end request.

			// Notify via Slack.

			static::slack_notify( $throwable );

		} catch ( \Throwable $throwable ) {
			// Fail softly.
		}
	}

	/**
	 * Posts a Slack notification.
	 *
	 * @since 2022-03-10
	 *
	 * @param \Throwable $throwable Throwable.
	 */
	protected static function slack_notify( \Throwable $throwable ) : void {
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
