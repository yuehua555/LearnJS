/*
 * @Author: George Wu
 * @Date: 2020-08-26 17:15:34
 * @LastEditors: George Wu
 * @LastEditTime: 2020-08-26 20:13:26
 * @FilePath: \jQuery\jQuery-3.5.1.js.js
 */
(function (global, factory) {
    "use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
})(this, function() {   // window
    
})