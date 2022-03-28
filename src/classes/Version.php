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
 * Version utilities.
 *
 * @since 2021-12-15
 */
final class Version extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Version\Members;

	/**
	 * Regular expression for semantic version.
	 *
	 * This is a modified version of the semver.org regexp.
	 * It's been modified only to make `minor` and `patch` optional,
	 * and to make the `pre_release` and `build_metadata` names snake_case.
	 *
	 * @since 2021-12-15
	 *
	 * @see   https://o5p.me/daPFmj
	 * @see   https://regex101.com/r/Ly7O1x/3/
	 */
	public const SEMANTIC_REGEXP = // Regular expression for semantic version.
		'/^' .
		'(?<major>0|[1-9]\d*)' .
		'(?:\.(?<minor>0|[1-9]\d*))?' .
		'(?:\.(?<patch>0|[1-9]\d*))?' .
		'(?:-(?<pre_release>(?:0|[1-9]\d*|\d*[a-zA-Z\-][0-9a-zA-Z\-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z\-][0-9a-zA-Z\-]*))*))?' .
		'(?:\+(?<build_metadata>[0-9a-zA-Z\-]+(?:\.[0-9a-zA-Z\-]+)*))?' .
		'$/u';

	/**
	 * Regular expression for loose semantic version.
	 *
	 * This is a modified version of the semver.org regexp.
	 * It's been modified extensively to check for a far less strict definition.
	 * This will work with versions that don't necessarily follow semver.org standards.
	 *
	 * @since 2021-12-15
	 */
	public const LOOSE_SEMANTIC_REGEXP = // Regular expression for loose semantic version.
		'/^' .
		'(?<major>0|[1-9]\d*)' .
		'(?:\.(?<minor>0|[1-9]\d*))?' .
		'(?:\.(?<patch>0|[1-9]\d*))?' .
		'(?:[.+#~_\-]*(?<other>[0-9a-zA-Z.+#~_\-]+))?' .
		'$/u';
}
