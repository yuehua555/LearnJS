/*
 * @Author: George Wu
 * @Date: 2020-08-01 20:47:42
 * @LastEditors: George Wu
 * @LastEditTime: 2020-08-09 16:43:41
 * @FilePath: \LearnJS\vue\compile.js
 */ 
(function(root){
    // 编译器默认配置  辅助函数
    var baseOptions = {};

    // Browser environment sniffing
    var inBrowser = typeof window !== 'undefined';
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = UA && /msie|trident/.test(UA);
    var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
    var isEdge = UA && UA.indexOf('edge/') > 0;
    var isAndroid = UA && UA.indexOf('android') > 0;
    var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
    var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

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

    // Special Elements (can contain anything)
    var isPlainTextElement = makeMap('script,style,textarea', true);
    var reCache = {};
    /**
     * Make a map and return a function for checking if a key
     * is in that map.
     */
    function makeMap (
        str,
        expectsLowerCase
    ) {
        var map = Object.create(null);
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        return expectsLowerCase
            ? function (val) { return map[val.toLowerCase()]; }
            : function (val) { return map[val]; }
    }

    function parseHTML(html, options) {
        //console.log(html);
        var stack = [];
        var expectHTML = options.expectHTML; // 编译器内部的选项
        var isUnaryTag$$1 = options.isUnaryTag || no; // 一个标签是否为一元标签
        var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no; // 可以省略闭合标签的非一元标签
        var index = 0; // 字符流读入的位置
        var last, lastTag;

        while(html) {    // <div id='app'>{{message}}</div>
            last = html;
            if (!lastTag || !isPlainTextElement(lastTag)) {
                var textEnd = html.indexOf('<');
                if (textEnd === 0) {
                    // End tag:
                    //console.log(endTag);
                    var endTagMatch = html.match(endTag);
                   // console.log(endTagMatch);
                    if (endTagMatch) {
                        var curIndex = index;
                        advance(endTagMatch[0].length);
                        parseEndTag(endTagMatch[1], curIndex, index);
                        continue;
                    }

                    // Start tag:
                    var startTagMatch = parseStartTag();
                    if (startTagMatch) {
                        handleStartTag(startTagMatch);
                    // if (shouldIgnoreFirstNewline(lastTag, html)) {
                    //     advance(1);
                    // }
                        continue;
                    }
                }
                var text = (void 0), rest = (void 0), next = (void 0);
                if (textEnd >= 0) {
                    rest = html.slice(textEnd);
                    while (
                    !endTag.test(rest) &&
                    !startTagOpen.test(rest) &&
                    !comment.test(rest) &&
                    !conditionalComment.test(rest)
                    ) {
                        // < in plain text, be forgiving and treat it as text
                        next = rest.indexOf('<', 1);
                       // console.log('next:' + next);
                        if (next < 0) { break }
                        textEnd += next;
                        rest = html.slice(textEnd);
                    }
                    text = html.substring(0, textEnd);
                    advance(textEnd);
                }

                if (textEnd < 0) {
                    text = html;
                    html = '';
                }

                // 解析文本调用的钩子函数
                if (options.chars && text) {
                    options.chars(text);
                }
                //console.log(html);
                
            }
           
       }

         /*
        检测非一元标签是否有闭合标签
        根据浏览器的特征处理<p> <br> 标签
        */
       function parseEndTag (tagName, start, end) {
        var pos, lowerCasedTagName;
        if (start == null) { start = index; }
        if (end == null) { end = index; }
    
        if (tagName) {
          lowerCasedTagName = tagName.toLowerCase();
        }
    
        //console.log(stack);
        // Find the closest opened tag of the same type
        if (tagName) {
          for (pos = stack.length - 1; pos >= 0; pos--) {
            if (stack[pos].lowerCasedTag === lowerCasedTagName) {
              break
            }
          }
        } else {
          // If no tag name is provided, clean shop
          pos = 0;
        }
    
        if (pos >= 0) {
          // Close all the open elements, up the stack
          for (var i = stack.length - 1; i >= pos; i--) {
            if (i > pos || !tagName) 
            {
             console.error(
                ("tag <" + (stack[i].tag) + "> has no matching end tag.")
              );
            }
            if (options.end) {
              options.end(stack[i].tag, start, end);
            }
          }
    
          // Remove the open elements from the stack
          stack.length = pos;
          lastTag = pos && stack[pos - 1].tag;
        } else if (lowerCasedTagName === 'br') {
          if (options.start) { // 调用start钩子函数 
            options.start(tagName, [], true, start, end);
          }
        } else if (lowerCasedTagName === 'p') {
          if (options.start) { // 调用start钩子函数 创建一个描述对象 DOM P
            options.start(tagName, [], false, start, end);
          }
          if (options.end) {
            options.end(tagName, start, end);
          }
        }
      }


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
                //console.log(args);
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
          
            if (options.start) {    // 创建描述对象 {} DOM节点 HTML字符串 子父级关系
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
            //console.log(html);
            var end, attr; // 非一元标签
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push(attr);
               // console.log(html);
            }
            if (end) {
                match.unarySlash = end[1]; // unarySlash "" 非一元标签 "/" 一元标签
                advance(end[0].length);
                match.end = index;
                //console.log(html);
                return match
            }
        }

    }

    var platformGetTagNamespace;
    
    function createASTElement (
        tag,
        attrs,
        parent
    ) {
        return {
        type: 1,  // type:1 元素节点, type: 2 文本节点
        tag: tag, 
        attrsList: attrs, // [{name: "id", value: "app"}]
        attrsMap: makeAttrsMap(attrs), // {id: "app"}
        parent: parent,
        children: [] // 当前元素的子节点，元素节点和文本节点
        }
    }
  
    function makeAttrsMap (attrs) {
        var map = {};
        for (var i = 0, l = attrs.length; i < l; i++) {
        if (
            "development" !== 'production' &&
            map[attrs[i].name] && !isIE && !isEdge
        ) {
            warn$2('duplicate attribute: ' + attrs[i].name);
        }
        map[attrs[i].name] = attrs[i].value;
        }
        return map
    }

  
    function platformGetTagNamespace() {}

    function isForbiddenTag (el) { // Element <script type="text/x-template"><script>
        return (
          el.tag === 'style' ||
          (el.tag === 'script' && (
            !el.attrsMap.type ||
            el.attrsMap.type === 'text/javascript'
          ))
        )
      }
    
    // 编译html  入口函数
    function parse(template) {
        
        var currentParent;
        var root;
        var stack = [];

        parseHTML(template, {
            start: function start (tag, attrs, unary) {
                //console.log(attrs);
                // check namespace.
                // inherit parent ns if there is one
                var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);
          
                // handle IE svg bug
                /* istanbul ignore if */
                if (isIE && ns === 'svg') {
                  attrs = guardIESVGBug(attrs);
                }
          
                var element = createASTElement(tag, attrs, currentParent);
                console.log(element);
                if (ns) {
                  element.ns = ns;
                }
          
                if (isForbiddenTag(element) && !isServerRendering()) {
                  element.forbidden = true;
                  "development" !== 'production' && warn$2(
                    'Templates should only be responsible for mapping the state to the ' +
                    'UI. Avoid placing tags with side-effects in your templates, such as ' +
                    "<" + tag + ">" + ', as they will not be parsed.'
                  );
                }
          
                // apply pre-transforms 静态和非静态的属性绑定 || 样式的绑定
                // for (var i = 0; i < preTransforms.length; i++) {
                //   element = preTransforms[i](element, options) || element;
                // }
          
                // 解析指令 v-if v-for once
                // if (!inVPre) {
                //   processPre(element);
                //   if (element.pre) {
                //     inVPre = true;
                //   }
                // }
                // if (platformIsPreTag(element.tag)) {
                //   inPre = true;
                // }
                // if (inVPre) {
                //   processRawAttrs(element);
                // } else if (!element.processed) {
                //   // structural directives
                //   processFor(element);
                //   processIf(element);
                //   processOnce(element);
                //   // element-scope stuff
                //   processElement(element, options);
                // }
          
                function checkRootConstraints (el) {
                  {
                    if (el.tag === 'slot' || el.tag === 'template') {
                      warnOnce(
                        "Cannot use <" + (el.tag) + "> as component root element because it may " +
                        'contain multiple nodes.'
                      );
                    }
                    if (el.attrsMap.hasOwnProperty('v-for')) {
                      warnOnce(
                        'Cannot use v-for on stateful component root element because ' +
                        'it renders multiple elements.'
                      );
                    }
                  }
                }
          
                // tree management
                if (!root) {
                  root = element;
                  checkRootConstraints(root);
                } else if (!stack.length) {
                  // allow root elements with v-if, v-else-if and v-else
                  if (root.if && (element.elseif || element.else)) {
                    checkRootConstraints(element);
                    addIfCondition(root, {
                      exp: element.elseif,
                      block: element
                    });
                  } else {
                    warnOnce(
                      "Component template should contain exactly one root element. " +
                      "If you are using v-if on multiple elements, " +
                      "use v-else-if to chain them instead."
                    );
                  }
                }
                if (currentParent && !element.forbidden) {
                  if (element.elseif || element.else) {
                    processIfConditions(element, currentParent);
                  } else if (element.slotScope) { // scoped slot
                    currentParent.plain = false;
                    var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                  } else {
                    currentParent.children.push(element);
                    element.parent = currentParent;
                  }
                }
                if (!unary) {
                  currentParent = element;  // 根节点的描述对象
                  stack.push(element);      // 在对象中构建元素节点的子父级关系
                } else {
                  //endPre(element);
                }
                // // apply post-transforms
                // for (var i$1 = 0; i$1 < postTransforms.length; i$1++) {
                //   postTransforms[i$1](element, options);
                // }
              },
            end: function(){
                 // remove trailing whitespace
                var element = stack[stack.length - 1];
                var lastNode = element.children[element.children.length - 1];
                // type: 3 静态文本节点 
                if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
                    element.children.pop();
                }
                // pop stack
                stack.length -= 1;
                currentParent = stack[stack.length - 1];
                //endPre(element);
            },
            chars: function(text){
                var children = currentParent.children;
                if (text !== ' ') {
                    children.push({
                      type: 3,
                      text: text
                    });
                }
            },
            comment: function(text){}
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