/* global Alloy, ENV_PROD */

// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

/**
 * It's a best practice to your code in alloy.js in a self-executing function
 * since any variable declared here will be in global scope and never garbage
 * collected. Use this or global to explicitly define a global, but rather
 * use Alloy.Globals or a CommonJS module you require where needed.
 */
(function(global) {

	// This variable would have been global without the SEF
	var versions = Ti.version.split('.');

	// Used in views/index.xml
	// This sample requires Ti SDK 5.1.0 or later
	Alloy.Globals.isSupported = (parseInt(versions[0], 10) >= 5 && parseInt(versions[1], 10) >= 1);

})(this);
