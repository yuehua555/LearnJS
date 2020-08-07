/*
 * @Author: George Wu
 * @Date: 2020-08-01 20:47:42
 * @LastEditors: George Wu
 * @LastEditTime: 2020-08-06 21:51:50
 * @FilePath: \LearnJS\vue\compile.js
 */ 
(function(root){
    // 编译器默认配置  辅助函数
    var baseOptions = {};

    var no = function() {};

    /**
   * Mix properties into target object.
   */
    function extend (to, _from) {
        for (var key in _from) {
            to[key] = _from[key];
        }
        return to
    }

    // 渲染函数 函数体
    function createFunction (code, errors) {
        try {
            return new Function(code)
        } catch (err) {
            errors.push({ err: err, code: code });
            return noop
        }
    }

    var createCompileToFunctionFn = function(compile) {
        var cache = Object.create(null);

        // template 模板字符串 用户配置对象 {} 
        return function compileToFunctions(template, options, vm){
            //console.log(template);
            options = extend({}, options);
            var warn$$1 = options.warn || console.error; // warn 错误 警告信息的收集 编译器内部
            delete options.warn;

             /* istanbul ignore if */
            {
                // detect possible CSP restriction
                try {
                new Function('return 1');
                } catch (e) {
                if (e.toString().match(/unsafe-eval|CSP/)) {
                    warn$$1(
                    'It seems you are using the standalone build of Vue.js in an ' +
                    'environment with Content Security Policy that prohibits unsafe-eval. ' +
                    'The template compiler cannot work in this environment. Consider ' +
                    'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                    'templates into render functions.'
                    );
                }
                }
            }

             // check cache
            var key = options.delimiters
                ? String(options.delimiters) + template
                : template;
            if (cache[key]) {
                return cache[key]
            }

            // compile 编译完成
            var compiled = compile(template, options);

            // check compilation errors/tips
            {
                if (compiled.errors && compiled.errors.length) { // 收集的编译错误信息
                    if (options.outputSourceRange) {
                        compiled.errors.forEach(function (e) {
                        warn$$1(
                            "Error compiling template:\n\n" + (e.msg) + "\n\n" +
                            generateCodeFrame(template, e.start, e.end),
                            vm
                        );
                        });
                    } else {
                        warn$$1(
                        "Error compiling template:\n\n" + template + "\n\n" +
                        compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
                        vm
                        );
                    }
                    }
                    if (compiled.tips && compiled.tips.length) { // 收集编译过程中的提示信息
                    if (options.outputSourceRange) {
                        compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
                    } else {
                        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
                    }
                }
            }


            var res = {};
            var fnGenErrors = [];
            res.render = createFunction(compiled.render, fnGenErrors); // render function 渲染函数
            res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
                return createFunction(code, fnGenErrors)
            });

            // check function generation errors.
            // this should only happen if there is a bug in the compiler itself.
            // mostly for codegen development use
            /* istanbul ignore if */
            {
                if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                    warn$$1(
                        "Failed to generate render function:\n\n" +
                        fnGenErrors.map(function (ref) {
                        var err = ref.err;
                        var code = ref.code;

                        return ((err.toString()) + " in\n\n" + code + "\n");
                    }).join('\n'),
                        vm
                    );
                }
            }

            return (cache[key] = res);
        }
    }

    var createCompilerCreator = function(baseCompile) {
        return function createCompiler(baseOptions) {
            function compile(
                template,
                options
            ) {
                //console.log(template);
                // {} __proto__ baseOpetions {}.xxxx 权限控制
                // 配置项的合并 1. 用户配置对象    2.默认配置对象
                var finalOptions = Object.create(baseOptions);
                var errors = [];
                var tips = [];

                var warn = function (msg, range, tip) {
                    (tip ? tips : errors).push(msg);
                };
          
                if (options) {
                    if (options.outputSourceRange) {
                      // $flow-disable-line
                      var leadingSpaceLength = template.match(/^\s*/)[0].length;
          
                      warn = function (msg, range, tip) {
                        var data = { msg: msg };
                        if (range) {
                          if (range.start != null) {
                            data.start = range.start + leadingSpaceLength;
                          }
                          if (range.end != null) {
                            data.end = range.end + leadingSpaceLength;
                          }
                        }
                        (tip ? tips : errors).push(data);
                      };
                    }
                    // merge custom modules
                    if (options.modules) {
                      finalOptions.modules =
                        (baseOptions.modules || []).concat(options.modules);
                    }
                    // merge custom directives
                    if (options.directives) {
                      finalOptions.directives = extend(
                        Object.create(baseOptions.directives || null),
                        options.directives
                      );
                    }
                    // copy other options extend
                    for (var key in options) {
                      if (key !== 'modules' && key !== 'directives') {
                        finalOptions[key] = options[key];
                      }
                    }
                  }

                var compiled = baseCompile(template.trim(), finalOptions);
                {
                    //detectErrors(compiled.ast, warn);
                }
                compiled.errors = errors;
                compiled.tips = tips;
                return compiled

            }
            return {
                compileToFunctions: createCompileToFunctionFn(compile)
            }
        }
    }
    
    var createCompiler = createCompilerCreator(function baseCompile (
        template,
        options
      ) {
        var ast = parse(template.trim(), options);
        if (options.optimize !== false) {
          optimize(ast, options);
        }
        var code = generate(ast, options);
        return {
          ast: ast,
          render: "",
          staticRenderFns: []
        }
      });

    // Regular Expressions for parsing tags and attributes
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
    // but for Vue templates we can enforce a simple charset
    var ncname = '[a-zA-Z_][\\w\\-\\.]*';
    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
    var startTagOpen = new RegExp(("^<" + qnameCapture));
    var startTagClose = /^\s*(\/?)>/;
    var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
    var doctype = /^<!DOCTYPE [^>]+>/i;
    var comment = /^<!--/;
    var conditionalComment = /^<!\[/;

    function parseHTML(html, options) {
        console.log(html);
        var stack = [];
        var expectHTML = options.expectHTML; // 编译器内部的选项
        var isUnaryTag$$1 = options.isUnaryTag || no; // 一个标签是否为一元标签
        var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no; // 可以省略闭合标签的非一元标签
        var index = 0; // 字符流读入的位置
        var last, lastTag;

        //while(html) {    // <div id='app'>{{message}}</div>
            last = html;
            if (!lastTag || !isPlainTextElement(lastTag)) {
                // Start tag:
                var startTagMatch = parseStartTag();
                if (startTagMatch) {
                    handleStartTag(startTagMatch);
                // if (shouldIgnoreFirstNewline(lastTag, html)) {
                //     advance(1);
                // }
                 //   continue
                }
            }
       // }
       function advance (n) {
            index += n;
            html = html.substring(n);
        }

                
        function handleStartTag (match) {
            var tagName = match.tagName;
            var unarySlash = match.unarySlash;

            var unary = !!unarySlash; // "" or "/"

            var l = match.attrs.length;
            var attrs = new Array(l);
            for (var i = 0; i < l; i++) {
                var args = match.attrs[i];
                console.log(args);
                var value = args[3] || args[4] || args[5] || '';
                attrs[i] = {
                    name: args[1],
                    value: value
                };
            }

            //console.log(attrs);
            if (!unary) {
                stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
                lastTag = tagName;
              }
          
            if (options.start) {
            options.start(tagName, attrs, unary, match.start, match.end);
            }
    }

        // startTagOpen 正则文法 token
        function parseStartTag () {
            var start = html.match(startTagOpen);
            //console.log(start);
            if (start) {
                var match = {
                  tagName: start[1],
                  attrs: [],
                  start: index
                };
            }
            advance(start[0].length);
            console.log(html);
            var end, attr; // 非一元标签
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push(attr);
                console.log(html);
            }
            if (end) {
                match.unarySlash = end[1]; // unarySlash "" 非一元标签 "/" 一元标签
                advance(end[0].length);
                match.end = index;
                console.log(html);
                return match
            }
        }

    }

    // 编译html  入口函数
    function parse(template) {
        //console.log(template);
        parseHTML(template, {
            start: function(){
                // AST 构建子父级关系
                console.log("解析开始标签调用的钩子函数");
            },
            end: function(){},
            chars: function(){},
            comment: function(){}
        });

    }

    // DIFF优化
    function optimize(){

    }

    //生成目标平台所需的代码
    function generate(){

    }
    

    var ref$1 = createCompiler(baseOptions);
    var compile = ref$1.compile;
    var compileToFunctions = ref$1.compileToFunctions;
  
    root.compile = compileToFunctions;
})(this);