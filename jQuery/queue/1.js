(function(global, factory) {
	if (typeof module === "object" && typeof module.exports === "object") {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory(global, true) :
			function(w) {
				if (!w.document) {
					throw new Error("jQuery requires a window with a document");
				}
				return factory(w);
			};
	} else {
		factory(global); //window
	}

})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
	var arr = [];
	var push = arr.push;

	var jQuery = function(selector, context) {
		return new jQuery.prototype.init(selector, context);
	}

	var version = "3.5.1";

	var isFunction = function isFunction(obj) {
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	};

	function cameCase(string) {
		return string.replace(/-([a-z])/g, function(all, letter) {
			return letter.toUpperCase();
		})
	}

	jQuery.fn = jQuery.prototype = {
		length: 0,
		init: function(selector, context) {
			if (!selector) {
				return this;
			}

			if (typeof selector === "string") {
				var elems = document.querySelectorAll(selector);
				for (var i = 0; i < elems.length; i++) {
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
		css: function() {

		},
		//...
	}
	jQuery.prototype.init.prototype = jQuery.fn;

	jQuery.extend = jQuery.fn.extend = function() {
		var option, name, deep, copy, src, copyIsArray, clone;
		var target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
		}

		if (typeof target !== "object" && !isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((option = arguments[i]) != null) {
				for (name in option) {
					copy = option[name];
					src = target[name];
					if (deep && (jQuery.isplainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						if (copyIsArray) {
							clone = src && jQuery.isArray(src) ? src : [];
							copyIsArray = false;
						} else {
							clone = src && jQuery.isplainObject(src) ? src : {};
						}
						target[name] = jQuery.extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	}

	jQuery.extend({
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
		isplainObject: function(obj) {
			return toString.call(obj) === "[object Object]"
		},
		isArray: function(obj) {
			return toString.call(obj) === "[object Array]"
		},
		makeArray: function(arr, results) {
			var ret = results || [];
			if (arr != null) {
				if (isArrayLike(arr)) { //是否是数组或者类数组的结果

				} else {
					push.call(ret, arr);
				}
			}
			return ret;
		}
	});

	function isArrayLike(obj) {
		var length = !!obj && "length" in obj && obj.length,
			type = toType(obj);

		if (isFunction(obj) || isWindow(obj)) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	}


	var optionsCache = {};

	jQuery.Callbacks = function(options) { //once stopOnFalse memory
		options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};

		var list = [];
		var index, length, testtings, memory, orignal, start;
		var fire = function(data) { //[context,["hello WE","小可爱"]]
			memory = options.memory && data;
			index = start || 0; //2
			start = 0;
			testtings = true;
			length = list.length;
			for (; index < length; index++) { // arguments ["..."]
				if (list[index].apply(data[0], data[1]) === false && options.stopOnFalse) { //== 隐式转化
					break;
				}
			}
		}

		var self = {
			add: function() {
				//arguments 类数组  -> 转化成数组对象   forEach
				var args = [].slice.call(arguments);
				orignal = list.length;
				args.forEach(function(fun) {
					if (isFunction(fun) && list.indexOf(fun) === -1) {
						list.push(fun);
					}
				})
				if (memory) {
					start = orignal;
					fire(memory);
				}
				return this;
			},
			//给所有的回调函数传参  fire("hello fire")
			fire: function() {
				self.fireWith(this, arguments); //["hello WE","小可爱"]
				return this;
			},
			//给所有的回调函数绑定上下文 this
			fireWith: function(context, args) { //["..."]
				var args = [context, args]; //["hello WE","小可爱"]
				if (!options.once || !testtings) { //undefined  true  false
					fire(args); //[context,["hello WE","小可爱"]]
				}

			}
		};
		return self;
	}


	jQuery.extend({
		Deferred: function(func) {
			//[resolve | reject |notify]  fire
			//[done | fail | progess ]    add
			var tuples = [
					["resolve", "done", jQuery.Callbacks("memory once"), "resolved"],
					["reject", "fail", jQuery.Callbacks("memory once"), "rejected"],
					["notify", "progess", jQuery.Callbacks("memory once")]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {

					},
					then: function( /*fnDone, fnFail, fnprogess*/ ) {
						var fns = arguments;
						return jQuery.Deferred(function(newDef) { //构建一个全新的deferred对象 
							tuples.forEach(function(tuple, i) { //3
								var fn = isFunction(fns[i]) && fns[i];
								//deferred === fist     newDef  === sencond
								deferred[tuple[1]](function() {
									var returned = fn && fn.apply(this, arguments);
									if (returned && isFunction(returned.promise)) {
										returned.promise() //returned  resolve   回调  newDef.resolve()
											.done(newDef.resolve)
											.fail(newDef.reject)
											.progess(newDef.notify);
									}
								});
							});
						}).promise();
					},
					promise: function(obj) {
						return obj != null ? jQuery.extend(obj, promise) : promise;
					}
				},
				deferred = {};

			tuples.forEach(function(tuple) {
				var list = tuple[2];
				var stateString = tuple[3];
				if (stateString) {
					list.add(function() {
						//[resolved | rejected] = state
						state = stateString;
					});
				}
				//promise[done | fail | progess]   只会往容器里面添加回调函数 不存在状态绑定  reject()  resove()
				promise[tuple[1]] = list.add;

				//deferred [resolve | reject | notify]
				deferred[tuple[0]] = function() { //权限控制
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments); //["..."]
				}
				//deferred[resolveWith | rejectWith | notifyWith ]
				deferred[tuple[0] + "With"] = list.fireWith;

			})
			if (func) {
				func.call(deferred, deferred);
			}
			promise.promise(deferred);
			return deferred;
		},
		when: function(subordinate /*subordinateN..*/ ) {
			var resolveValue = [].slice.call(arguments),
				i = 0,
				length = resolveValue.length,
				remaining = length !== 1 || (subordinate && isFunction(subordinate.promise)) ? length : 0,
				deferred = length === 1 ? subordinate : jQuery.Deferred();

			if (length > 1) {
				for (; i < length; i++) {
					if (resolveValue[i] && isFunction(resolveValue[i].promise)) {
						resolveValue[i].promise()
							.done(function() {
								if (!(--remaining)) {
									deferred.resolveWith(this, arguments);
								}
							})
							.fail(deferred.reject)
					}
				}
			}


			return deferred.promise();
		},
		style: function(elem, key, value) {
			elem.style[key] = value;
		},
		css: function(elem, key) {
			var Computed = window.getComputedStyle(elem);
			return Computed.getPropertyValue(key);
		}
	});


	var noInnterHTML = /<script | <style | <link /i;

	jQuery.fn.extend({
		html: function(value) {
			return access(this, function(value) {
				var elem = this[0] || {};
				var i = 0,
					l = this.length;

				//get
				if (value === undefined) {
					return elem.innerHTML;
				}

				//set
				if (typeof value === "string" && !noInnterHTML.test(value)) {
					for (; i < l; i++) {
						elem = this[i];
						if (elem.nodeType === 1) {
							elem.innerHTML = value;
						}
					}
				}

			}, null, value, arguments.length);
		},
		css: function(key, value) {
			return access(this, function(elem, key, value) {
				var Computed, i = 0,
					map = {};

				if (Array.isArray(key)) {
					Computed = window.getComputedStyle(elem);
					for (; i < key.length; i++) {
						map[key[i]] = Computed.getPropertyValue(key[i]);
					}
					return map;
				}

				return value !== undefined ? jQuery.style(elem, key, value) : jQuery.css(elem, key)
			}, key, value, arguments.length > 1);
		}
	});

	var class2type = {};

	function toType(obj) {
		if (obj === null) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[toString.call(obj)] || "object" : //检测
			typeof obj;
	}

	"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});


	//用来获取和设置集合值的多功能的方法
	var access = function(elems, fn, key, value, chainable, amptyGet, raw) {
		var len = elems.length;
		var i = 0;
		var bulk = key == null; //bulk  true

		//sets many values
		if (toType(key) === "object") {
			chainable = true;
			for (i in key) {
				access(elems, fn, i, key[i], true, amptyGet, raw);
			}
			//sets one values
		} else if (value != undefined) { //1
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
					//包装函数
					fn = function(elem, key, value) {
						return bulk.call(jQuery(elem), value);
					}
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

		//get
		if (bulk) {
			return fn.call(elems);
		}

		return len ? fn(elems[0], key) : emptyGet;
	}

	function Data() {
		this.expando = jQuery.expando + Data.Uid++;
	}

	Data.Uid = 1;

	Data.prototype = {
		cache: function(owner) {
			var value = owner[this.expando];
			//if not create one
			if (!value) {
				value = {};
				if (owner.nodeType === 1 || owner.nodeType === 9) {
					owner[this.expando] = value;
				}
			}
			return value;
		},
		access: function(owner, key, value) {
			if (key === undefined || ((key && typeof key === "string") && value === undefined)) {
				return this.get(owner, key);
			}

			this.set(owner, key, value); //fxqueueHook
			//console.log(owner[this.expando])
			return value !== undefined ? value : key;
		},
		get: function(owner, key) {
			return key === undefined ? this.cache(owner) : owner[this.expando] && owner[this.expando][cameCase(key)];
		},
		remove: function(owner, key) {
			console.log(owner[ this.expando ])
			var i = key.length,
				cache = owner[this.expando];    //fxqueue   fxqueueHooks
			while (i--) {
				delete cache[key[i]];
			}
			console.log(cache)
		},
		set: function(owner, data, value) { //key
			var cache = this.cache(owner);  //DOM
			if (toType(data) === "string") {
				cache[cameCase(data)] = value; //fxqueueHook:{}
			}
			return cache;
		}
	}

	//存储用户定义的数据对象
	var dataUser = new Data();
	//存储内部事件 动画队列的数据 (priv)私人 隐私
	var dataPriv = new Data();

	jQuery.fn.extend({
		data: function(key, value) {
			var elem = this[0];
			//Get all values
			if (key === undefined) {
				if (this.length) {
					var data = dataUser.get(elem); // dataUser.get(elem, key);
				}
				return data;
			}
			//Set
			return access(this, function(value) {
				//Get one values
				if (elem && value === undefined) {
					data = dataUser.get(elem, key); //lastValue
					if (data != undefined) return data;

					//处理HTML5 data-* 属性
					data = dataAttr(elem, key);
					if (data != undefined) return data;
				}
				dataUser.set(elem, key, value);
			}, null, value, arguments.length > 1, null, true);
		}
	})

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

	function getData(data) {
		if (data === +data + "" || (res = rbrace.exec(data))) {
			if (+data === 0) return 0;
			return +data || res && JSON.parse(res[0]);
		}
		return data === "true" ? true : data === "false" ? false : data === "null" ? null : data;
	}


	function dataAttr(elem, key, data) { //optionsRef    undefined
		var name;
		if (data === undefined && elem.nodeType === 1) {
			//data-options     => dataOptions   data-options-ref
			name = "data-" + key.replace(/[A-Z]/g, "-$&").toLowerCase();

			data = elem.getAttribute(name); //data-options
			if (toType(data) === "string") {
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
				queue = dataPriv.get(elem, type);

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

	if (typeof define === "function" && define.amd) {
		define("jquery", [], function() {
			return jQuery;
		});
	}

	if (typeof noGlobal === "undefined") {
		window.jQuery = window.$ = jQuery;
	}

	function createOptions(options) {
		var object = optionsCache[options] = {};
		//["memory","once"]
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		})
		return object;
	}


	return jQuery;
});
