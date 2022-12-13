/**
 * Utility class.
 */

/**
 * Git utilities.
 */
export default class $Git {
	/**
	 * Converts a `.gitignore` file into glob patterns.
	 *
	 * @param   ignoreFileContents `.gitignore` file contents.
	 * @param   options            An options object (which is optional).
	 *
	 * @returns                    An array of glob patterns compatible with `micromatch` and `fast-glob`.
	 *
	 * @see https://git-scm.com/docs/gitignore
	 */
	public static ignoreGlobs(ignoreFileContents: string, options = { negate: false }): Array<string> {
		const globPatterns = [];

		for (let line of ignoreFileContents.trim().split(/[\r\n]+/u)) {
			line = line.trim();

			if (0 === line.indexOf('#')) {
				continue; // Comment line.
			} else if ('' === line || '!' === line) {
				continue; // Actually an empty line.
			}
			let glob = line; // Glob pattern.

			const isNegated = 0 === glob.indexOf('!');
			glob = isNegated ? glob.slice(1) : glob;

			const slashIndex = glob.indexOf('/');
			const containsSlash = -1 !== slashIndex;
			const startsWithSlash = 0 === slashIndex;
			const endsWithSlash = slashIndex === glob.length - 1;
			const isRelative = startsWithSlash || (containsSlash && slashIndex < glob.length - 1);

			if (startsWithSlash) {
				glob = glob.slice(1);
			}
			if (endsWithSlash) {
				glob = glob.slice(0, -1);
			}
			if (!isRelative && !glob.startsWith('**/')) {
				glob = '**/' + glob;
			}
			if (!glob.endsWith('/**')) {
				glob = glob + '/**';
			}
			if (isNegated) {
				glob = '!' + glob;
			}
			if (options.negate) {
				glob = 0 === glob.indexOf('!') ? glob.slice(1) : '!' + glob;
			}
			globPatterns.push(glob);
		}
		return globPatterns;
	}
}
