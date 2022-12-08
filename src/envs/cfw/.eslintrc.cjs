/* eslint-env es2021, node */

const path        = require( 'path' );
const srcDir      = __dirname; // This directory.
const projRootDir = path.resolve( __dirname, '../../../' );

module.exports = {
	root    : true,
	extends : [ projRootDir + '/.eslintrc.cjs' ],

	parserOptions : {
		babelOptions : require( projRootDir + '/dev/.files/rollup/babel.cjs' )(
			'./' + path.relative( projRootDir, srcDir ),
		),
	},
	overrides     : [
		{
			files         : [ '*.{tsx,ts}', '**/*.{tsx,ts}' ],
			parserOptions : { tsconfigRootDir : srcDir },
		},
	],
};
