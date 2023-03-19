/**
 * Brand utilities.
 */

import { getClass } from './resources/classes/brand.js';
import type { RawProps, Interface } from './resources/classes/brand.js';

/**
 * Brand instances.
 */
const instances: { [x: string]: Interface } = {};

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
 * Gets a brand instance.
 *
 * @param   q Brand numeronym, slug, or var.
 *
 * @returns   Brand {@see Interface}.
 */
export const get = (q: string): Interface => {
	q = '&' === q ? 'c10n' : q;
	if (!q) throw new Error('Empty brand query.');

	if (!rawProps[q] /* Not an n7m. Try searching by `slug|var`. */) {
		for (const [_n7m, _rawProps] of Object.entries(rawProps)) {
			if (q === _rawProps.slug || q === _rawProps.var) {
				if (rawProps[_n7m]) return get(_n7m);
			}
		}
		throw new Error('Missing brand: `' + q + '`.');
	}
	const n7m = q; // n7m (numeronym).

	if (instances[n7m]) {
		return instances[n7m];
	}
	const Brand = getClass(); // Class definition.

	if (rawProps[n7m].org === n7m) {
		instances[n7m] = new Brand({ ...rawProps[n7m], org: undefined });
	} else {
		instances[n7m] = new Brand({ ...rawProps[n7m], org: get(rawProps[n7m].org) });
	}
	return instances[n7m]; // Brand instance.
};
