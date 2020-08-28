/*
 * @Author: George Wu
 * @Date: 2020-08-26 17:15:34
 * @LastEditors: George Wu
 * @LastEditTime: 2020-08-28 22:28:15
 * @FilePath: \jQuery\jQuery-3.5.1.js
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
})(typeof window !== "undefined" ? window : this, function( window, noGlobal){

	var isFunction = function isFunction( obj ) {
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	};

	var jQuery = function () {
		return new jQuery.prototype.init();
	};
	
	jQuery.fn = jQuery.prototype = {
		init: function () {
			
		},
		css: function () {
			
		},
		//... 扩展
	}

	// 生态， extend 1. 对内，2. 对外
	jQuery.prototype.init.prototype = jQuery.fn;

	// $.extend() $.fn.extend() $.extend({}, def, options); this
	// 1。参数不固定 有可能是一个， 有可能是多个
	jQuery.extend = jQuery.fn.extend = function () {

		var option, name;
		var target = arguments[0] || {}; // 确保第一个参数有值，
		var i = 1;
		var length = arguments.length;
		var deep;
		var copy, src;

		// $.extend({}, def, options); 确定按照原有的逻辑给target 扩展
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
		}

		//  第一个参数 并且为对象
		if (typeof target !=='object' && !isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this; //$.extend() this => jQuery 本身 $.fn.extend() this => jQuery 实例对象
			i--;
		}
		
		for (; i < length; i++) {
			if(((option = arguments[i]) != null)) { // undefined
				for (name in option) {
					//console.log(name);
					target[name] = option[name];
				}

			}
		}

		return target;
		
	}
	
	// commonjs 规定模块长什么样子
	// requirejs seajs 模块加载器的工具
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function() {
			return jQuery;
		} );
	}

	if ( typeof noGlobal === "undefined" ) {
		window.jQuery = window.$ = jQuery;
	}
	

	return jQuery;
})