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

	var jQuery = function() {
		return new jQuery.prototype.init();
	}

	var isFunction = function isFunction(obj) {
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	};

	jQuery.fn = jQuery.prototype = {
		init: function() {

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
			fireWith: function(context, args) {   //["..."]
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
									if(returned && isFunction(returned.promise)){
										returned.promise()     //returned  resolve   回调  newDef.resolve()
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
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);  //["..."]
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
				length = resolveValue.length,
				//如果只有一个异步任务 把异步函数的返回值给到deferred
				deferred = length === 1 ? subordinate : jQuery.Deferred();
			return deferred.promise();
		}
	});

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
