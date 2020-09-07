/*
 * @Author: George Wu
 * @Date: 2020-08-26 17:15:34
 * @LastEditors: George Wu
 * @LastEditTime: 2020-09-07 20:21:08
 * @FilePath: \queue\jQuery-3.5.1.js
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

	var version = '3.5.1';
	var arr = [];
	var push = arr.push;
	
	var isFunction = function isFunction( obj ) {
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	};

	function cameCase(string) {
		return string.replace(/-([a-z])/g, function(all, letter) {
		  //console.log(all + ':' + letter)
		  return letter.toUpperCase();
		});
	}
	var jQuery = function (selector, context) {
		return new jQuery.prototype.init(selector, context);
	};
	
	jQuery.fn = jQuery.prototype = {
		length: 0,
		init: function (selector, context) {
			if (!selector) {
				return this;
			}

			if (typeof selector === 'string') {
				let elems = document.querySelectorAll(selector);
				for (let i = 0; i < elems.length; i++) {
					this[i] = elems[i];
				}
				this.length = elems.length;
				this.selector = selector;
				this.context = document;
				return this;
			}

			if (selector.nodeType) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}
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
		expando: 'jQuery' + (version+Math.random()).replace(/\D/g, ''),
		isPlaninObject: function (obj) {
			return toString.call(obj) === '[object Object]';
		},
		isArray: function (obj) {
			return toString.call(obj) === '[object Array]';
		},
		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					//console.log(ret, arr);
					//ret.push(arr);
					push.call(ret, arr);
				}
			}

			return ret;
		},

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
			let i = 0;
			let remaining = length !==1 || (subordinate && isFunction(subordinate.promise)) ? length : 0;
			
			deferred = length === 1 ? subordinate : jQuery.Deferred();
			if (length > 1) {
				for (;i < length; i++) {
					if (resolveValue[i] && isFunction(resolveValue[i].promise)) {
						resolveValue[i].promise()
						.done(function() {
							if (!(--remaining)) {
								deferred.resolveWith(this, arguments);
							}
						})
						.fail(deferred.reject);
					}
				}
			}
					
			
			return deferred.promise();
		},
		style: function(elem, key, value) {
			elem.style[key] = value;
		},
		css: function(elem, key) {
			let computed = window.getComputedStyle(elem);
			return computed.getPropertyValue(key);
		}
	});

	let noInnerHTML = /<script | <style | <link /i;
	jQuery.fn.extend({
		html: function(value){
			return access(this, function(value) {
				let elem = this[0] || {};
				let i = 0;
				let len = this.length;

				// get
				if (value === undefined) {
					return elem.innerHTML;
				}

				// set
				if (typeof value === 'string' && !noInnerHTML.test(value)) {
					for (; i < len; i++) {
						elem = this[i];
						if (elem.nodeType === 1) {
							elem.innerHTML = value;
						}
					}
				}
			}, null, value, arguments.length);
		},
		css: function(key, value){
			return access(this, function(elem, key, value){
				let i = 0;
				let map = [];
				//let computed;
				
				//console.log(elem)
				if (Array.isArray(key)){
					let computed = window.getComputedStyle(elem);
					//console.log(computed);
					for (; i < key.length; i++) {
						map[key[i]] = computed.getPropertyValue(key[i]);
					}
					return map;
				}
				return value != undefined ? jQuery.style(elem, key, value) : jQuery.css(elem, key);
			}, key, value, arguments.length>1);
			
		}
	});

	let class2type = {};

	'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ').forEach(function(name){
		class2type['[object ' + name + ']'] = name.toLowerCase();	
	});
	function toType(obj) {
		//console.log(class2type);
		if (obj == null) {
			return obj + "";
		}
		return typeof obj === 'object' || typeof obj === 'function' ?
			class2type[toString.call(obj)] || 'object' :
			typeof obj;
	}

	// 用来获取和设置集合值的多功能的方法
	let access = function(elems, fn, key, value, chainable, emptyget, raw) {
		let bulk = key == null;
		let len = elems.length;
		let i = 0;

		// sets many value
		if (toType(key) === 'object') {
			chainable = true;
			for (i in key) {
				access(elems, fn, i, key[i], true, emptyget, raw);
			}


          // sets one value           
		} else if (value != undefined) {
			chainable = true;

			if (!isFunction(value)) {
				raw = true;
			}
			if (bulk) {
				if (raw) {
					fn.call(elems, value);
					fn = null;
				} else {
					bulk = fn;
					// 包装的函数
					fn = function(elems, key, value) {
						return bulk.call(jQuery(elems), value);
					};
				}
			}

			
			if (fn) {
				for (; i < len; i++) {
					fn(elems[i], key, raw ? value : value.call(elems[i], i));
				}
			}	
		}

		if (chainable) {
			return elems;
		}
		
		// get
		if (bulk) {
		   return fn.call(elems);
		}

		return len ? fn(elems[0], key) : emptyget;

	};


	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;
	Data.prototype = {
		cache: function(owner){
			var value = owner[this.expando];
			// if not create one
			if (!value) {
				value = {};
				if (owner.nodeType === 1 || owner.nodeType === 9) {
					owner[this.expando] = value;
				}
			}
			return value;
		},
		get: function(owner, key) {
			console.log(owner[this.expando])
			return key === undefined ? this.cache(owner) : owner[this.expando][cameCase(key)];
		},
		set: function(owner, data, value){ // key
			//console.log(owner);
			var cache = this.cache(owner);
			if (toType(data) === 'string') {
				cache[cameCase(data)] = value;
			}
			console.log(owner[this.expando]);
			console.log(cache);
			return cache;
		},
		access: function( owner, key, value ) {

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {
	
				return this.get( owner, key );
			}
	
			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );
	
			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i,
				cache = owner[ this.expando ];
	
			if ( cache === undefined ) {
				return;
			}
	
			if ( key !== undefined ) {
	
				// Support array or space separated string of keys
				if ( Array.isArray( key ) ) {
	
					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map( camelCase );
				} else {
					key = camelCase( key );
	
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ?
						[ key ] :
						( key.match( rnothtmlwhite ) || [] );
				}
	
				i = key.length;
	
				while ( i-- ) {
					delete cache[ key[ i ] ];
				}
			}
	
			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {
	
				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	// 存储用户定义的数据对象
	var dataUser = new Data();
	//console.log(dataUser.expando);
	var dataPriv = new Data();
	//console.log(dataPriv.expando);
	
	jQuery.fn.extend({
		data: function(key, value){
			var elem = this[0];
			// get
			if (key === undefined) {
				if (this.length) {
					var data = dataUser.get(elem);
				}
				return data;
			}

			// set
			return access(this, function(value){

				// get one value
				if (elem && value == undefined) {
					data = dataUser.get(elem, key);
					if (data != undefined) return data;

					// 处理HTML5 data-* 属性
					data = dataAttr(elem, key);
					if (data != undefined) return data;
				}

				dataUser.set(elem, key, value);
			}, null, value, arguments.length>1, null, true);
		}
	});
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
	var rmultiDash = /[A-Z]/g;

	function getData( data ) {
		if ( data === +data + "" || (res = rbrace.exec( data ))) {
			if(+data === 0)return 0;
			return +data || res && JSON.parse(res[0]);  
		}
		return data === "true" ? true : data === "false"? false : data === "null" ? null : data;
	}

	// function getData( data ) {
	// 	if ( data === "true" ) {
	// 		return true;
	// 	}

	// 	if ( data === "false" ) {
	// 		return false;
	// 	}

	// 	if ( data === "null" ) {
	// 		return null;
	// 	}

	// 	// Only convert to a number if it doesn't change the string
	// 	if ( data === +data + "" ) {
	// 		return +data;
	// 	}

	// 	if ( rbrace.test( data ) ) {
	// 		return JSON.parse( data );
	// 	}

	// 	return data;
	// }
	
	function dataAttr(elem, key, data) {
		var name;
		if (data === undefined && elem.nodeType === 1) {
			// data-options => dataOptions
			name = 'data-' + key.replace(/[A-Z]/g, '-$&').toLowerCase();
			//console.log(name);
			data = elem.getAttribute(name); 
			//console.log(data);
			if(toType(data) ==="string"){
				data = getData(data);
		  }
		  dataUser.set(elem, key, data);
		}

		return data;
	}

	jQuery.extend({
		queue: function(elem, type, data) {
			var queue;
			if (elem) {
				type = (type || "fx") + "queue"; //fxqueue  
				//queue = dataPriv.get(elem, type);
				//console.log(queue);

				if (data) {
					if (!queue || Array.isArray(data)) { //data  类数组
						//function(){} =>  [function(){}]
						queue = dataPriv.access(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
			}
			return queue || [];
		},
		dequeue: function(elem, type) {
			type = type || "fx";
			var queue = jQuery.queue(elem, type),    //["inprogress"]
				startLength = queue.length,
				fn = queue.shift(),    
				hooks = jQuery._queueHooks(elem, type),
				next = function() {
					jQuery.dequeue(elem, type);
				};
			
			//防止queue 队列中的回调函数意外的出列
			if ( fn === "inprogress" ) {
				fn = queue.shift();   
				startLength--;    //0
			}

			if (fn) {
               if ( type === "fx" ) {     //["inprogress", fn2]
               	queue.unshift( "inprogress" );   // ["inprogress"]
               }
			   fn.call( elem, next, hooks );
			}
			
			//hooks  钩子  扫尾的工作
			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}

		},
		_queueHooks: function(elem, type) {
           var key = type + "queueHooks";  //fx
		   return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			   //self
		   	empty: jQuery.Callbacks( "once memory" ).add( function() {
		   		dataPriv.remove( elem, [ type + "queue", key ] );  //fxqueue   fxqueueHook
		   	})
		   });
		}
	})


	jQuery.fn.extend({
		queue: function(type, data) {
			var setter = 2;
			if (typeof type !== "string") {
				data = type; //function(){...}
				type = "fx";
				setter--; // 1
			}

			if (arguments.length < setter) {
				return jQuery.queue(this[0], type);
			}

			if (data !== undefined) { //DOM  .box
				var queue = jQuery.queue(this[0], type, data);
			} else {
				return this;
			}
			return queue || [];
		},
		dequeue: function(type) {
			jQuery.dequeue(this[0], type);
		}
	})

	
	function isArrayLike( obj ) {

		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = toType( obj );
	
		if ( isFunction( obj ) || isWindow( obj ) ) {
			return false;
		}
	
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
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