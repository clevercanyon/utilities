/**
 * Base utility class.
 */

import $a6tꓺBase from './base.js';
const appPkgName = $$__APP_PKG_NAME__$$;

/**
 * Abstract base utility class.
 */
export default abstract class Utility extends $a6tꓺBase {
	/**
	 * Object constructor.
	 *
	 * @param props Props or {@see Utility} instance.
	 */
	public constructor(props?: object | Utility) {
		super({ appPkgName, props });
	}
}
