/**
 * Tailwind CSS config file.
 *
 * @since 1.0.0
 *
 * @note Tailwind doesn't know where this file lives.
 * If you ever need to call tailwind directly be sure to tell it.
 * It's not an issue at this time because we don't call it directly.
 *
 * @internal `assetsDir` is a relative path, as given.
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
Example `config.c10n.&.tailwind` in `../../../package.json`:
-----------------------------------------------------------------------------------------------------------------------
"config"          : {
	"c10n" : {
		"&" : {
			"tailwind" : {
				"config" : {
					"theme" : {
						"fontFamily" : {
							"sans"  : [ "Georama", "sans-serif" ],
							"serif" : [ "Georgia", "serif" ]
						}
					}
				}
			},
			"tailwind:./src": {
				"config" : {}
			}
		}
	}
}
-----------------------------------------------------------------------------------------------------------------------
Example `index.scss` starter file contents:
-----------------------------------------------------------------------------------------------------------------------
@import 'https://fonts.googleapis.com/css2?family=Georama:ital,wght@0,100..900;1,100..900&display=swap';

@tailwind base;
@tailwind components;
@tailwind utilities;
------------------------------------------------------------------------------------------------- @formatter:/ignore */

const fs   = require( 'fs' );
const path = require( 'path' );
const mc   = require( '@clevercanyon/js-object-mc' );

module.exports = ( srcDir = '' ) => {
	// Initialize global data.

	const globalData = { config : {} };

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
				mc.patch( globalData, fileData?.config?.c10n?.[ '&' ]?.tailwind || {} );
				break;
		}
	}
	// Now establish a configuration for this src directory.

	const absSrcDir = path.resolve( __dirname, '../../../', srcDir );

	const srcDirConfig = {
		theme   : {
			fontFamily : {
				sans  : [ 'Georama', 'sans-serif' ],
				serif : [ 'Georgia', 'serif' ],
			},
		},
		content : [
			path.join( absSrcDir, '*.{md,xml,html,shtml,php,js,cjs,jsx,ts,tsx}' ),
			path.join( absSrcDir, '**/*.{md,xml,html,shtml,php,js,cjs,jsx,ts,tsx}' ),
		],
	};
	// Merge custom config data that's global.

	mc.patch( srcDirConfig, globalData.config || {} );

	// Merge custom config data for this src directory.

	for ( const [ fileName, fileData ] of Object.entries( customDataByFile ) ) {
		switch ( fileName ) {
			case 'package.json':
				mc.patch( srcDirConfig, fileData?.config?.c10n?.[ '&' ]?.[ 'tailwind:' + srcDir ]?.config || {} );
				break;
		}
	}
	// Return config.

	return srcDirConfig;
};
