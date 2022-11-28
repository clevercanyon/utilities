/**
 * Webpack config file.
 *
 * @since 1.0.0
 *
 * @note Webpack is not aware of this config file's location.
 *       Please use `--config ./dev/.files/webpack/config.cjs`.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * This file and the contents of it are updated automatically.
 *
 * - Instead of editing this file, please configure `../../../package.json`. See instructions below.
 * - Instead of editing this file, please review source repository {@see https://o5p.me/LevQOD}.
 */
/* eslint-env es2021, node */

/* @formatter:ignore
-----------------------------------------------------------------------------------------------------------------------
Example `config.c10n.&.webpack` using `../../../package.json`:
-----------------------------------------------------------------------------------------------------------------------
"config"          : {
	"c10n" : {
		"&" : {
			"webpack" : {
				"srcDirs" : [ "./src" ],
				"config"  : {
					"target" : "es2021"
				}
			},
			"webpack:./src": {
				"config" : {}
			}
		}
	}
}
-----------------------------------------------------------------------------------------------------------------------
Example src directory structure expected for webpack:
-----------------------------------------------------------------------------------------------------------------------
../../../src (or any other location):
	- assets/* (static files)
	- styles/index.{css,scss}
	- scripts/index.{js,cjs,jsx,ts,tsx}
	- webpack/ (output directory)
------------------------------------------------------------------------------------------------- @formatter:/ignore */

const fs      = require( 'fs' );
const path    = require( 'path' );
const miniCss = require( 'mini-css-extract-plugin' );
const mc      = require( '@clevercanyon/js-object-mc' );

module.exports = ( env, argv ) => {
	const configs = []; // Initialize.

	// Initialize global data.

	const globalData = { srcDirs : [ './src' ], config : {} };

	// Get custom data by file.

	const customDataByFile = {}; // Initialize.

	try { // Try `package.json` data.
		customDataByFile[ 'package.json' ] = require( '../../../package.json' );
	} catch ( e ) {
		customDataByFile[ 'package.json' ] = {};
	}
	// Merge custom data, that's global, into global data.

	for ( const [ fileName, fileData ] of Object.entries( customDataByFile ) ) {
		switch ( fileName ) {
			case 'package.json':
				mc.patch( globalData, fileData?.config?.c10n?.[ '&' ]?.webpack || {} );
				break;
		}
	}
	// Now establish a configuration for each src directory.

	( globalData.srcDirs || [] ).forEach( ( srcDir ) => {
		if ( ! /^(?:\.\/)?src(?:\/|$)/ui.test( srcDir ) ) {
			return; // Invalid src directory.
		}
		const distDir = srcDir.replace( /^(\.\/)?(src)(\/|$)/ui, '$1dst$3' );

		const absSrcDir = path.resolve( __dirname, '../../../', srcDir );
		const absDstDir = path.resolve( __dirname, '../../../', srcDir );

		const absSrcDirIndexes = []; // Initialize indexes.

		[ '.css', '.scss' ].every( ext => {
			if ( fs.existsSync( absSrcDir + '/styles/index' + ext ) ) {
				absSrcDirIndexes.push( absSrcDir + '/styles/index' + ext );
				return false; // Break.
			}
			return true; // Continue.
		} );
		[ '.js', '.cjs', '.jsx', '.ts', '.tsx' ].every( ext => {
			if ( fs.existsSync( absSrcDir + '/scripts/index' + ext ) ) {
				absSrcDirIndexes.push( absSrcDir + '/scripts/index' + ext );
				return false; // Break.
			}
			return true; // Continue.
		} );
		if ( ! absSrcDirIndexes.length ) {
			return; // No indexes available.
		}
		const srcDirConfig = { // Base configuration.
			cache       : false,
			mode        : 'production',
			devtool     : 'source-map',
			target      : 'es2021',
			experiments : { topLevelAwait : true },
			plugins     : [ new miniCss( { filename : '[name].min.css' } ) ],
			resolve     : { extensions : [ '.js', '.cjs', '.jsx', '.ts', '.tsx', '.json', '.wasm' ] },
			module      : {
				rules : [
					{
						test : /\.(?:txt|md)$/ui,
						use  : [ { loader : 'raw-loader', options : {} } ],
					},
					{
						test : /\.(?:xml|html|shtml)$/ui,
						use  : [ { loader : 'html-loader', options : {} } ],
					},
					{
						test : /\.(?:gif|jpe?g|png|svg|eot|ttf|woff[0-9]*)$/ui,
						use  : [ { loader : 'file-loader', options : {} } ],
					},
					{
						test : /\.(?:css|scss)$/ui,
						use  : [
							{ loader : miniCss.loader, options : {} },
							{ loader : 'css-loader', options : {} },
							{ loader : 'postcss-loader', options : require( './postcss.cjs' )( srcDir ) },
							{ loader : 'sass-loader', options : {} },
						],
					},
					{
						test    : /\.(?:js|cjs|jsx|ts|tsx)$/ui,
						exclude : [ /\/(?:node_modules\/(?:core-js|webpack\/buildin))\//ui ],
						use     : [ { loader : 'babel-loader', options : require( './babel.cjs' )( srcDir ) } ],
					},
				],
			},
			entry       : {
				index : absSrcDirIndexes,
			},
			output      : {
				path     : absDstDir + '/webpack',
				filename : '[name].min.js',
			},
		};
		// Merge custom config data that's global.

		mc.patch( srcDirConfig, globalData.config || {} );

		// Merge custom config data for this src directory.

		for ( const [ fileName, fileData ] of Object.entries( customDataByFile ) ) {
			switch ( fileName ) {
				case 'package.json':
					mc.patch( srcDirConfig, fileData?.config?.c10n?.[ '&' ]?.[ 'webpack:' + srcDir ]?.config || {} );
					break;
			}
		}
		// Push config onto stack.

		configs.push( srcDirConfig );
	} );
	return configs;
};
