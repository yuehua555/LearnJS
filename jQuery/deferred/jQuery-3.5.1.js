/*
 * @Author: George Wu
 * @Date: 2020-08-26 17:15:34
 * @LastEditors: George Wu
 * @LastEditTime: 2020-09-01 21:22:41
 * @FilePath: \deferred\jQuery-3.5.1.js
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
		var clone;

		// $.extend({}, def, options); 确定按照原有的逻辑给target 扩展
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
		}

		//  第一个或第二个（如果第一个为布尔值）参数 并且为对象
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
					copy = option[name];  // 遍历的对象属性值
					src = target[name];   // 扩展的对象属性值
					if (deep && ( jQuery.isPlaninObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						if (copyIsArray) {
							// copy 是一个数组
							clone = src && jQuery.isArray(src) ? src : [];
							copyIsArray = false;
						} else {
							// copy 是一个对象
							clone = src && jQuery.isPlaninObject(src) ? src : {};	
						} 
						// 浅拷贝
						target[name] = jQuery.extend(deep, clone, copy);
					} else if (copy !== undefined) {
						//console.log(target);
						if (toString.call(target) === '[object Array]') {
							//target[name] = copy;
							// console.log('src = ' + src);
							// console.log(target);
							// console.log(name);
							// console.log(copy);
							//target[name] = copy;
							if (src !== copy) {
								target.push(copy);
							}
							
						} else {
							target[name] = copy;
						}
										
					}
				}

			}
		}

		return target;
		
	}
	
	jQuery.extend({
		isPlaninObject: function (obj) {
			return toString.call(obj) === '[object Object]';
		},
		isArray: function (obj) {
			return toString.call(obj) === '[object Array]';
		}
	});


	var optionsCache = {};
	jQuery.Callbacks = function(options) {// once stopOnFalse memory

		options = typeof options === 'string' ? (optionsCache[options] || createOptions(options)) : {};
		var list = [];
		var index, length, testings;
		var start, original;
		var memory;

		var fire = function(data) {

		    memory = options.memory && data;

			index = start || 0;
			start = 0;
			testings = true;
			length = list.length;
			for (; index < length; index++) {{
				//console.log(data[0]);
				if (list[index].apply(data[0], data[1]) === false && options.stopOnFalse) { // ==隐式转化
					break;
				}
			}}

		}

		var self = {
			add: function(){
				// arguments 类数组 -> 转化成数组对象 forEach
				var args = [].slice.call(arguments);
				original = list.length;
				args.forEach(function(fun) {
					//console.log(fun);
					if (isFunction(fun) && list.indexOf(fun) === -1) {
						list.push(fun);
					}
				});
				
				if (memory) {
					start = original;
					fire(memory);
				}

				return this;
			},
			// 给所有的回调函数传参 
			fire: function(){
				self.fireWith(this, arguments);
				return this;
			},
			// 给所有的回调函数绑定上下文 this
			fireWith: function(context, args){
				var parameters = [context, args];
				if (!(options.once) || !testings) {
					fire(parameters);
				}	
			}
		};

		return self;
	}

	jQuery.extend({
		Deferred: function (func) {
			// [resolve | reject | notify]  fire
			// [done | fail | progress]  add
			let tuples = [
				['resolve', 'done', jQuery.Callbacks('memory once'), 'resolved'],
				['reject', 'fail', jQuery.Callbacks('memory once'), 'rejected'],
				['notify', 'progress', jQuery.Callbacks('memory once')]
			];
			let state = 'pending';
			let promise = {
				state: function() {
					return state;
				},
				always: function() {

				},
				then: function(/* fnDone, fnFail, fnProgress*/) {
					let fns = arguments;
					 return jQuery.Deferred(function(newDef){ // 构建一个全新的deferred对象
						tuples.forEach(function(tuple, i){
							let fn = isFunction(fns[i]) && fns[i];
							// deferred === first newDef === second
							deferred[tuple[1]](function(){
								let returned = fn && fn.apply(this, arguments);
								if (returned && isFunction(returned.promise)) {
									returned.promise()
									.done(newDef.resolve)
									.fail(newDef.reject)
									.progress(newDef.notify);
								}
							});
						});

					}).promise();

				},
				
				promise: function(obj) {
					return obj != null ? jQuery.extend(obj, promise) : promise;
				}
			};
			let deferred = {};

			tuples.forEach(function(tuple) {
				let list = tuple[2];
				//console.log(list);
				let stateString = tuples[3];
				if (stateString) {
					list.add(function() {
						// [resolved | rejected ] = state
						state = stateString;
					});
				}
				
				// promise[done | fail | progress]
				// 只会往容器里添加回调函数，不存在状态绑定
				promise[tuple[1]] = list.add;
			
				// //deferred [resolve | reject | notify]
				deferred[tuple[0]] = function() { //权限控制
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);  //["..."]
				}
				//deferred[resolveWith | rejectWith | notifyWith ]
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			if (func) {
				func.call(deferred, deferred);
			}
			promise.promise(deferred);
			return deferred;
		},
		when: function(subordinate) {
			let resolveValue = [].slice.call(arguments);
			let length = resolveValue.length;

			// 如果只有一个异步任务 把异步函数的返回值给到deferred
			deferred = length === 1 ? subordinate : jQuery.Deferred();
			return deferred.promise();
		}
	});
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
	

	function createOptions(options) {
		var object = optionsCache[options] = {};
		//["memory","once"]
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		});
	
		return object;
	}

	return jQuery;
})