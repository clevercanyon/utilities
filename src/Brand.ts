/**
 * Utility class.
 */

/**
 * Brand props.
 */
interface BaseProps {
	readonly n7m: string;

	readonly name: string;
	readonly namespace: string;

	readonly slug: string;
	readonly var: string;

	readonly slugPrefix: string;
	readonly varPrefix: string;

	readonly rootDomain: string;

	readonly aws: {
		readonly s3: {
			readonly bucket: string;
			readonly cdnDomain: string;
		};
	};
	readonly google: {
		readonly analytics: {
			readonly ga4GtagId: string;
		};
	};
	readonly cloudflare: {
		readonly accountId: string;
		readonly zoneId: string;
	};
}
interface RawProps extends BaseProps {
	readonly org: string;
}
interface ConstructorProps extends BaseProps {
	readonly org?: Brand | null;
}
interface Props extends BaseProps {
	readonly org: Brand;
}

/**
 * Brand instances.
 */
const instances: { [x: string]: Brand } = {};

/**
 * Raw brand props by N7M.
 */
const rawProps: { readonly [x: string]: RawProps } = {
	'c10n': {
		'org': 'c10n',
		'n7m': 'c10n',
		'name': 'Clever Canyon',
		'namespace': 'Clever_Canyon',
		'slug': 'clevercanyon',
		'var': 'clevercanyon',
		'slugPrefix': 'clevercanyon-',
		'varPrefix': 'clevercanyon_',
		'rootDomain': 'clevercanyon.com',
		'aws': {
			's3': {
				'bucket': 'clevercanyon',
				'cdnDomain': 'cdn.clevercanyon.com',
			},
		},
		'google': {
			'analytics': {
				'ga4GtagId': 'G-Y5BS7MMHMD',
			},
		},
		'cloudflare': {
			'accountId': 'f1176464a976947aa5665d989814a4b1',
			'zoneId': 'f8a39e1ad05c2b452f1e18e699ad2129',
		},
	},
	'w4s': {
		'org': 'c10n',
		'n7m': 'w4s',
		'name': 'Wobots',
		'namespace': 'Wobots',
		'slug': 'wobots',
		'var': 'wobots',
		'slugPrefix': 'wobots-',
		'varPrefix': 'wobots_',
		'rootDomain': 'wobots.com',
		'aws': {
			's3': {
				'bucket': 'wobots',
				'cdnDomain': 'cdn.wobots.com',
			},
		},
		'google': {
			'analytics': {
				'ga4GtagId': 'G-3SHM64QZNK',
			},
		},
		'cloudflare': {
			'accountId': 'f1176464a976947aa5665d989814a4b1',
			'zoneId': 'accc8038a3c1f4dc8a060161d3eed763',
		},
	},
};

/**
 * Brand utilities.
 */
export class Brand implements Props {
	/**
	 * Org brand object.
	 */
	public readonly org: Brand;

	/**
	 * N7M; e.g., `m5d`.
	 */
	public readonly n7m: string;

	/**
	 * Name; e.g., `My Brand`.
	 */
	public readonly name: string;

	/**
	 * Namespace; e.g., `My_Brand`.
	 */
	public readonly namespace: string;

	/**
	 * Slug; e.g., `my-brand`.
	 */
	public readonly slug: string;

	/**
	 * Var; e.g., `my_brand`.
	 */
	public readonly var: string;

	/**
	 * Slug prefix; e.g., `my-brand-`.
	 */
	public readonly slugPrefix: string;

	/**
	 * Var prefix; e.g., `my_brand_`.
	 */
	public readonly varPrefix: string;

	/**
	 * Root domain; e.g., `my-brand.com`.
	 */
	public readonly rootDomain: string;

	/**
	 * AWS properties.
	 */
	public readonly aws: {
		readonly s3: {
			readonly bucket: string;
			readonly cdnDomain: string;
		};
	};

	/**
	 * Google properties.
	 */
	public readonly google: {
		readonly analytics: {
			readonly ga4GtagId: string;
		};
	};

	/**
	 * Cloudflare properties.
	 */
	public readonly cloudflare: {
		readonly accountId: string;
		readonly zoneId: string;
	};

	/**
	 * Constructor.
	 *
	 * @param props Properties.
	 */
	public constructor(props: ConstructorProps) {
		if (props.org instanceof Brand) {
			this.org = props.org;
		} else {
			this.org = this;
		}
		this.n7m = props.n7m;

		this.name = props.name;
		this.namespace = props.namespace;

		this.slug = props.slug;
		this.var = props.var;

		this.slugPrefix = props.slugPrefix;
		this.varPrefix = props.varPrefix;

		this.rootDomain = props.rootDomain;

		this.aws = props.aws;
		this.google = props.google;
		this.cloudflare = props.cloudflare;
	}
}

/**
 * Gets a brand instance.
 *
 * @param   q Brand numeronym (recommended), slug, or var.
 *
 * @returns   Brand instance; else `null` on failure to locate.
 */
export function get(q: string): Brand | null {
	q = '&' === q ? 'c10n' : q;

	if (!q) return null; // Not available.

	if (!rawProps[q] /* Not an n7m. Search by `slug|var`. */) {
		for (const [_n7m, _rawProps] of Object.entries(rawProps)) {
			if (q === _rawProps.slug || q === _rawProps.var) return get(_n7m);
		}
		return null; // Not available.
	}
	const n7m = q; // Query is an n7m (numeronym).

	if (instances[n7m]) {
		return instances[n7m];
	}
	const rawBrand = rawProps[n7m];
	const rawBrandOrg = rawBrand.org === n7m ? '' : rawBrand.org;

	instances[n7m] = new Brand({ ...rawBrand, org: get(rawBrandOrg) });
	return instances[n7m]; // Brand instance.
}
