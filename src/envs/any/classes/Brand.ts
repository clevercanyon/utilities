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
import { default as uA6tBase } from './a6t/Base';

// </editor-fold>

/**
 * Brand props.
 *
 * @since 2022-04-25
 */
interface uBrandBaseProps {
	readonly n7m : string;

	readonly name : string;
	readonly namespace : string;

	readonly slug : string;
	readonly var : string;

	readonly slugPrefix : string;
	readonly varPrefix : string;

	readonly rootDomain : string;

	readonly aws : {
		readonly s3 : {
			readonly bucket : string;
			readonly cdnDomain : string;
		}
	};
	readonly google : {
		readonly analytics : {
			readonly ga4GtagId : string;
		}
	};
	readonly cloudflare : {
		readonly accountId : string;
		readonly zoneId : string;
	};
}
interface uBrandRawProps extends uBrandBaseProps {
	readonly org? : string | null;
}
interface uBrandConstructorProps extends uBrandBaseProps {
	readonly org? : uBrand | null;
}
interface uBrandProps extends uBrandBaseProps {
	readonly org : uBrand;
}

/**
 * Raw brand props by N7M.
 *
 * @since 2022-04-25
 */
const uRawBrandPropsByN7M : { readonly [ x : string ] : uBrandRawProps } = {
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
};

/**
 * Brand utilities.
 *
 * @since 2022-04-25
 */
export default class uBrand extends uA6tBase implements uBrandProps {
	/**
	 * Brand instances.
	 *
	 * @since 2022-03-22
	 */
	protected static instances : { [ x : string ] : uBrand } = {};

	/**
	 * Org brand object.
	 *
	 * @since 2022-03-22
	 */
	public readonly org : uBrand;

	/**
	 * N7M; e.g., `m5d`.
	 *
	 * @since 2022-03-22
	 */
	public readonly n7m : string;

	/**
	 * Name; e.g., `My Brand`.
	 *
	 * @since 2022-03-22
	 */
	public readonly name : string;

	/**
	 * Namespace; e.g., `My_Brand`.
	 *
	 * @since 2022-03-22
	 */
	public readonly namespace : string;

	/**
	 * Slug; e.g., `my-brand`.
	 *
	 * @since 2022-03-22
	 */
	public readonly slug : string;

	/**
	 * Var; e.g., `my_brand`.
	 *
	 * @since 2022-03-22
	 */
	public readonly var : string;

	/**
	 * Slug prefix; e.g., `my-brand-`.
	 *
	 * @since 2022-03-22
	 */
	public readonly slugPrefix : string;

	/**
	 * Var prefix; e.g., `my_brand_`.
	 *
	 * @since 2022-03-22
	 */
	public readonly varPrefix : string;

	/**
	 * Root domain; e.g., `my-brand.com`.
	 *
	 * @since 2022-08-22
	 */
	public readonly rootDomain : string;

	/**
	 * AWS properties.
	 *
	 * @since 2022-03-22
	 */
	public readonly aws : {
		readonly s3 : {
			readonly bucket : string;
			readonly cdnDomain : string;
		}
	};

	/**
	 * Google properties.
	 *
	 * @since 2022-03-22
	 */
	public readonly google : {
		readonly analytics : {
			readonly ga4GtagId : string;
		}
	};

	/**
	 * Cloudflare properties.
	 *
	 * @since 2022-03-22
	 */
	public readonly cloudflare : {
		readonly accountId : string;
		readonly zoneId : string;
	};

	/**
	 * Constructor.
	 *
	 * @since 2022-03-22
	 *
	 * @param {uBrandConstructorProps} props Properties.
	 */
	protected constructor( props : uBrandConstructorProps ) {
		super();

		if ( props.org instanceof uBrand ) {
			this.org = props.org;
		} else {
			this.org = this;
		}
		this.n7m = props.n7m;

		this.name      = props.name;
		this.namespace = props.namespace;

		this.slug = props.slug;
		this.var  = props.var;

		this.slugPrefix = props.slugPrefix;
		this.varPrefix  = props.varPrefix;

		this.rootDomain = props.rootDomain;

		this.aws        = props.aws;
		this.google     = props.google;
		this.cloudflare = props.cloudflare;
	}

	/**
	 * Brand factory.
	 *
	 * @since 2022-03-22
	 *
	 * @param {string} n7m Brand numeronym.
	 *
	 * @return {uBrand|null} Brand; else `null`.
	 */
	public static get( n7m : string ) : uBrand | null {
		n7m = '&' === n7m ? 'c10n' : n7m;

		if ( ! n7m || ! uRawBrandPropsByN7M[ n7m ] ) {
			return null; // Not available.
		}
		if ( uBrand.instances[ n7m ] ) {
			return uBrand.instances[ n7m ];
		}
		const rawBrand          = uRawBrandPropsByN7M[ n7m ];
		const rawBrandOrg       = rawBrand.org === n7m ? '' : ( rawBrand.org || '' );
		uBrand.instances[ n7m ] = new uBrand( { ...rawBrand, org : uBrand.get( rawBrandOrg ) } );

		return uBrand.instances[ n7m ]; // Brand instance.
	}
}
