/**
 * Polyfills missing types.
 */

declare module 'lodash/wrapperLodash.js' {
	import wrapperLodash from 'lodash';
	export = wrapperLodash;
}

declare module 'lodash/conforms.js' {
	import { conforms } from 'lodash';
	export = conforms;
}

declare module 'lodash/stubArray.js' {
	import { stubArray } from 'lodash';
	export = stubArray;
}

declare module 'lodash/stubObject.js' {
	import { stubObject } from 'lodash';
	export = stubObject;
}

declare module 'lodash/stubString.js' {
	import { stubString } from 'lodash';
	export = stubString;
}
