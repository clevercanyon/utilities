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
import { default as uA6tBase }   from './a6t/Base';
import { default as uRawBrands } from '../includes/brands';

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

		if ( ! n7m || ! uRawBrands[ n7m ] ) {
			return null; // Not available.
		}
		if ( uBrand.instances[ n7m ] ) {
			return uBrand.instances[ n7m ];
		}
		const rawBrand          = uRawBrands[ n7m ] as uBrandRawProps;
		const rawBrandOrg       = rawBrand.org === n7m ? '' : ( rawBrand.org || '' );
		uBrand.instances[ n7m ] = new uBrand( { ...rawBrand, org : uBrand.get( rawBrandOrg ) } );

		return uBrand.instances[ n7m ]; // Brand instance.
	}
}
