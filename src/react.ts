/**
 * Utility class.
 */

/**
 * Props interface.
 */
interface Props {
	classes?: string | string[];
}

/**
 * Formats component classes.
 *
 * @param   classes Prefix class(es).
 * @param   props   Component props.
 *
 * @returns         Space separated classes.
 */
export function classes(classes: string | string[], props: Props): string {
	classes = '' === classes ? [] : classes;
	classes = !Array.isArray(classes) ? Array(classes) : classes;

	let propClasses = props.classes || [];
	propClasses = '' === propClasses ? [] : propClasses;
	propClasses = !Array.isArray(propClasses) ? Array(propClasses) : propClasses;

	return classes.concat(propClasses).join(' ');
}
