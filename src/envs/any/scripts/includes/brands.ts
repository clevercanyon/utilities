/**
 * Clever Canyon™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Imports and other headers.">

/**
 * Imports.
 *
 * @since 2022-04-25
 */
// None at this time.

// </editor-fold>

/**
 * Brands.
 *
 * @since 2022-04-25
 */
export default {
	'c10n' : {
		'org'        : 'c10n',
		'n7m'        : 'c10n',
		'name'       : 'Clever Canyon',
		'namespace'  : 'Clever_Canyon',
		'slug'       : 'clevercanyon',
		'var'        : 'clevercanyon',
		'slugPrefix' : 'clevercanyon-',
		'varPrefix'  : 'clevercanyon_',
		'rootDomain' : 'clevercanyon.com',
		'aws'        : {
			's3' : {
				'bucket'    : 'clevercanyon',
				'cdnDomain' : 'cdn.clevercanyon.com',
			},
		},
		'google'     : {
			'analytics' : {
				'ga4GtagId' : 'G-Y5BS7MMHMD',
			},
		},
		'cloudflare' : {
			'accountId' : 'f1176464a976947aa5665d989814a4b1',
			'zoneId'    : 'f8a39e1ad05c2b452f1e18e699ad2129',
		},
	},
	'w4s'  : {
		'org'        : 'c10n',
		'n7m'        : 'w4s',
		'name'       : 'Wobots',
		'namespace'  : 'Wobots',
		'slug'       : 'wobots',
		'var'        : 'wobots',
		'slugPrefix' : 'wobots-',
		'varPrefix'  : 'wobots_',
		'rootDomain' : 'wobots.com',
		'aws'        : {
			's3' : {
				'bucket'    : 'wobots',
				'cdnDomain' : 'cdn.wobots.com',
			},
		},
		'google'     : {
			'analytics' : {
				'ga4GtagId' : 'G-3SHM64QZNK',
			},
		},
		'cloudflare' : {
			'accountId' : 'f1176464a976947aa5665d989814a4b1',
			'zoneId'    : 'accc8038a3c1f4dc8a060161d3eed763',
		},
	},
} as { readonly [ x : string ] : object };
