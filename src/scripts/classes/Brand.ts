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
import mapByN7m                        from '../../../brands.json';
import { default as uA6tStcUtilities } from './a6t/StcUtilities';

// </editor-fold>

/**
 * Brand props.
 *
 * @since 2022-04-25
 */
interface uBrandProps {
	org : uBrand | null;
	n7m : string;

	name : string;
	namespace : string;

	slug : string;
	var : string;

	slug_prefix : string;
	var_prefix : string;

	root_domain : string;

	aws : {
		s3 : {
			bucket : string;
			cdn_domain : string;
		}
	};
	google : {
		analytics : {
			ga4_gtag_id : string;
		}
	};
	cloudflare : {
		account_id : string;
		zone_id : string;
	};
}

/**
 * Brand utilities.
 *
 * @since 2022-04-25
 */
export default class uBrand extends uA6tStcUtilities {
	/**
	 * Brand instances.
	 *
	 * @since 2022-03-22
	 */
	protected static instances : uBrand[] = [];

	/**
	 * Org brand object.
	 *
	 * @since 2022-03-22
	 */
	protected org : uBrand;

	/**
	 * N7M; e.g., `m5d`.
	 *
	 * @since 2022-03-22
	 */
	protected n7m : string;

	/**
	 * Name; e.g., `My Brand`.
	 *
	 * @since 2022-03-22
	 */
	protected name : string;

	/**
	 * Namespace; e.g., `My_Brand`.
	 *
	 * @since 2022-03-22
	 */
	protected namespace : string;

	/**
	 * Slug; e.g., `my-brand`.
	 *
	 * @since 2022-03-22
	 */
	protected slug : string;

	/**
	 * Var; e.g., `my_brand`.
	 *
	 * @since 2022-03-22
	 */
	protected var : string;

	/**
	 * Slug prefix; e.g., `my-brand-`.
	 *
	 * @since 2022-03-22
	 */
	protected slug_prefix : string;

	/**
	 * Var prefix; e.g., `my_brand_`.
	 *
	 * @since 2022-03-22
	 */
	protected var_prefix : string;

	/**
	 * Root domain; e.g., `my-brand.com`.
	 *
	 * @since 2022-08-22
	 */
	protected root_domain : string;

	/**
	 * AWS properties.
	 *
	 * @since 2022-03-22
	 */
	protected aws : object;

	/**
	 * Google properties.
	 *
	 * @since 2022-03-22
	 */
	protected google : object;

	/**
	 * Cloudflare properties.
	 *
	 * @since 2022-03-22
	 */
	protected cloudflare : object;

	/**
	 * Constructor.
	 *
	 * @param {uBrandProps} props Properties.
	 */
	public constructor( props : uBrandProps ) {
		super();

		this.org = props.org || this;
		this.n7m = props.n7m;

		this.name      = props.name;
		this.namespace = props.namespace;

		this.slug = props.slug;
		this.var  = props.var;

		this.slug_prefix = props.slug_prefix;
		this.var_prefix  = props.var_prefix;

		this.root_domain = props.root_domain;

		this.aws        = props.aws;
		this.google     = props.google;
		this.cloudflare = props.cloudflare;
	}

	protected static factory( n7m : string ) : uBrand {
		n7m = '&' === n7m ? 'c10n' : n7m;

		if ( ! n7m || ! mapByN7m [ n7m ] ) {
			return null; // Not available.
		}
		if ( uBrand.instances[ n7m ] ) {
			return uBrand.instances[ n7m ];
		}
		const org_n7m           = mapByN7m[ n7m ].org_n7m;
		const org               = null === org_n7m ? null : uBrand.factory( org_n7m );
		uBrand.instances[ n7m ] = new uBrand( { org, ...mapByN7m[ n7m ] } );

		return uBrand.instances[ n7m ];
	}
}
