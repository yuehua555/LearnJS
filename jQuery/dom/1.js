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

	var jQuery = function(selector, context) {
		return new jQuery.prototype.init(selector, context);
	}

	var isFunction = function isFunction(obj) {
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	};

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
		isplainObject: function(obj) {
			return toString.call(obj) === "[object Object]"
		},
		isArray: function(obj) {
			return toString.call(obj) === "[object Array]"
		}
	});

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
		var bulk = key == null; //bulk  false

		console.log('bulk='+ bulk);
		console.log('key='+ key);


        console.log(toType(key));
		//sets many values
		if (toType(key) === "object") {
			chainable = true;
			for (i in key) {
				access(elems, fn, i, key[i], true, amptyGet, raw);
			}
			//sets one values
		} else if (value != undefined) { //false
			chainable = true;

			if (!isFunction(value)) {
				raw = true;
			}

			console.log(bulk);
			if (bulk) {
				if (raw) {
					fn.call(elmes, value);
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
