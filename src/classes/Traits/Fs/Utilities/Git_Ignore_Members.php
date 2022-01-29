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
namespace Clever_Canyon\Utilities\Traits\Fs\Utilities;

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
 * @see   U\Fs
 */
trait Git_Ignore_Members {
	/**
	 * Regexp with `.gitignore` exclusions as a positive|negative lookahead pattern.
	 *
	 * @since 2021-12-18
	 *
	 * @param string      $lookahead       One of `positive` or `negative`.
	 *                                     This indicates whether you want a positive or negative lookahead.
	 *
	 * @param string|null $regexp_fragment Optional regexp fragment to append to generated full regexp pattern.
	 *                                     Default is `.+$`. You get back simply the lookahead pattern in front of `.+$`.
	 *
	 * @param array       $args            Optional arguments that offer some additional options.
	 *
	 *    string 'modifiers'      Optional additional modifiers to append to existing always-on modifiers.
	 *                            Always-on modifiers include `ui`. If you pass in conflicting modifiers, future versions
	 *                            of this function will throw an exception if they cause conflict with this function's objectives.
	 *
	 *    bool   'vendor'         Default is `true`, as ignoring `/vendor` matches our `.gitignore` configuration.
	 *                            That said, it's often desirable to ship `/vendor` as part of a distro, so the option is here.
	 *
	 *    string 'except:vendor/' Default is ``. When `vendor` is `true`, this adds one or more exceptions.
	 *                            e.g., `[ 'except:vendor/' => 'clevercanyon' ]`.
	 *                            e.g., `[ 'except:vendor/' => '(?:clevercanyon|acme)' ]`.
	 *
	 * @return string Final regexp with `.gitignore` exclusions as a positive|negative lookahead.
	 *                The pattern is a non-capturing positive|negative lookahead for greatest flexibility.
	 *
	 * @see   https://regex101.com/r/yceJKL/1
	 * @see   https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php
	 */
	public static function gitignore_regexp_lookahead(
		string $lookahead,
		/* string|null */ ?string $regexp_fragment = null,
		array $args = []
	) : string {
		$regexp_fragment ??= '.+$';

		$default_args = [
			'modifiers'      => '',
			'vendor'         => true,
			'except:vendor/' => '',
		];
		$args         = $args + $default_args;

		$modifiers = mb_str_split( $args[ 'modifiers' ] );
		$modifiers = array_unique( array_merge( [ 'u', 'i' ], $modifiers ) );
		$modifiers = implode( '', $modifiers ); // Back together again.

		$re = '';    // Initialize for string concatenation.
		$re .= '/^'; // Beginning of line, or file path, in this case.

		$re .= '    (' . ( 'positive' === $lookahead ? '?=' : '?!' );
		$re .= '        .*';             // 0+ characters leading up to matching `.gitignore` entries.
		$re .= '        (?:^|[\/\\\]+)'; // Beginning of string or 1+ directory separators.
		$re .= '        (?:';            // Begin list of matching `.gitignore` entries.

		$re .= '            (?:\.[#_~][^\/\\\]*)'; // `.#*`, `._*`, `.~*`
		$re .= '             |(?:[^\/\\\]*~)';     // `*~` backup files.

		// This covers all ignored file extensions.
		$re .= '             |(?:[^\/\\\]*\.(?:log|bak|rej|orig|patch|diff|sublime-project|sublime-workspace|nbproject|code-workspace|ctags|tags))';

		// This covers all ignored dotfiles; i.e., names beginning with a `.`.
		$re .= '             |(?:\.(?:vagrant|idea|vscode|npmrc|yarnrc|yarn|linaria-cache|sass-cache|elasticbeanstalk|git|git-dir|svn|cvsignore|bzr|bzrignore|hg|hgignore|AppleDB|AppleDouble|AppleDesktop|com\.apple\.timemachine\.donotpresent|LSOverride|Spotlight-V100|VolumeIcon\.icns|TemporaryItems|fseventsd|DS_Store|Trashes|apdisk))';

		// This covers everything else, which is a longer list of specific names to ignore.
		$re .= '             |(?:typings' . ( $args[ 'vendor' ] ? '|vendor' . ( $args[ 'except:vendor/' ] ? '(?![\/\\\]+' . $args[ 'except:vendor/' ] . '[\/\\\]+)' : '' ) : '' ) . '|node[_\-]modules|jspm[_\-]packages|bower[_\-]components|_svn|CVS|SCCS|RCS|\$RECYCLE\.BIN|Desktop\.ini|Thumbs\.db|ehthumbs\.db|Network\sTrash\sFolder|Temporary\sItems|Icon[^s])';

		$re .= '        )';              // End list of matching `.gitignore` entries.
		$re .= '        (?:$|[\/\\\]+)'; // End of line, or 1+ directory separators.

		$re .= '    )'; // End lookahead group.

		$re .= $regexp_fragment; // Appends a regular expression fragment onto all of the above.
		$re .= '/' . $modifiers; // Ends regular expression and adds modifiers, including any custom modifiers.

		return preg_replace( '/\s+/u', '', $re ); // Removes whitespace from pattern.
	}

	/**
	 * Regexp with `.gitignore` exclusions as a positive lookahead pattern, for PHPCS/PHPCBF tools.
	 *
	 * Regarding PHPCS/PHPCBF tools. {@see https://git.io/J9nrw}.
	 *
	 * In PHPCS/PHPCBF, `*` is auto-expanded into `.*` at runtime.
	 * Unescaped commas are pattern delimiters. To get a real comma, must escape: `\\,`.
	 *
	 * Directory separators, on Windows, are replaced with `\\` on-the-fly at runtime, so use only `/` here.
	 * The regular expression pattern is encapsulated by `backticks`i at runtime and uses an `i` modifier only.
	 *
	 * Patterns that end with `/*` are tested against both directories and files. Otherwise, files only.
	 * A `/*` on the end of the pattern is replaced by `(?=/|$)` at runtime.
	 *
	 * @since 2021-12-18
	 *
	 * @param string $base_path The PHPCS/PHPCBF tools treat `--ignore=` patterns as absolute path checks.
	 *                          We can force them to be treated as relative path checks by prefixing
	 *                          our pattern with a base path that we're giving to these tools.
	 *
	 * @param array  $args      Optional arguments that offer some additional options.
	 *
	 *    bool   'vendor'         Default is `true`, as ignoring `/vendor` matches our `.gitignore` configuration.
	 *                            That said, it's often desirable to ship `/vendor` as part of a distro, so the option is here.
	 *
	 *    string 'except:vendor/' Default is ``. When `vendor` is `true`, this adds one or more exceptions.
	 *                            e.g., `[ 'except:vendor/' => 'clevercanyon' ]`.
	 *                            e.g., `[ 'except:vendor/' => '(?:clevercanyon|acme)' ]`.
	 *
	 * @return string Final regexp with `.gitignore` exclusions as a positive lookahead.
	 *                The pattern is a non-capturing positive lookahead for greatest flexibility.
	 */
	public static function gitignore_phpcs_regexp_lookahead_positive( string $base_path, array $args = [] ) : string {
		$lookahead       = 'positive';
		$regexp_fragment = '.+/*'; // `/*` becomes `(?=/|$)`.

		$default_args = [
			'vendor'         => true,
			'except:vendor/' => '',
		];
		$args         = $args + $default_args;

		$re = '';   // Initialize for string concatenation.
		$re .= U\Str::esc_reg( U\Fs::normalize( $base_path ), '`' );

		$re .= '^'; // Beginning of line, or file path, in this case.

		$re .= '    (' . ( 'positive' === $lookahead ? '?=' : '?!' );
		$re .= '        *';        // 0+ characters leading up to matching `.gitignore` entries.
		$re .= '        (?:^|/+)'; // Beginning of string or 1+ directory separators.
		$re .= '        (?:';      // Begin list of matching `.gitignore` entries.

		$re .= '            (?:\.[#_~][^/]{0\\,})'; // `.#*`, `._*`, `.~*`
		$re .= '             |(?:[^/]{0\\,}~)';     // `*~` backup files.

		// This covers all ignored file extensions.
		$re .= '             |(?:[^/]{0\\,}\.(?:log|bak|rej|orig|patch|diff|sublime-project|sublime-workspace|nbproject|code-workspace|ctags|tags))';

		// This covers all ignored dotfiles; i.e., names beginning with a `.`.
		$re .= '             |(?:\.(?:vagrant|idea|vscode|npmrc|yarnrc|yarn|linaria-cache|sass-cache|elasticbeanstalk|git|git-dir|svn|cvsignore|bzr|bzrignore|hg|hgignore|AppleDB|AppleDouble|AppleDesktop|com\.apple\.timemachine\.donotpresent|LSOverride|Spotlight-V100|VolumeIcon\.icns|TemporaryItems|fseventsd|DS_Store|Trashes|apdisk))';

		// This covers everything else, which is a longer list of specific names to ignore.
		$re .= '             |(?:typings' . ( $args[ 'vendor' ] ? '|vendor' . ( $args[ 'except:vendor/' ] ? '(?!/+' . $args[ 'except:vendor/' ] . '/+)' : '' ) : '' ) . '|node[_\-]modules|jspm[_\-]packages|bower[_\-]components|_svn|CVS|SCCS|RCS|\$RECYCLE\.BIN|Desktop\.ini|Thumbs\.db|ehthumbs\.db|Network\sTrash\sFolder|Temporary\sItems|Icon[^s])';

		$re .= '        )';        // End list of matching `.gitignore` entries.
		$re .= '        (?:$|/+)'; // End of line, or 1+ directory separators.

		$re .= '    )'; // End lookahead group.

		$re .= $regexp_fragment; // Appends a regular expression fragment onto all of the above.

		return preg_replace( '/\s+/u', '', $re ); // Removes whitespace from pattern.
	}
}
