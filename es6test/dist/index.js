"use strict";

/*
 * @Author: George Wu
 * @Date: 2020-08-23 22:48:27
 * @LastEditors: George Wu
 * @LastEditTime: 2020-08-25 16:02:28
 * @FilePath: \es6test\src\index.js
 */
// function jspang(...arg) {
//     console.log(arg[0]);
//     console.log(arg[1]);
//     console.log(arg[2]);
//     console.log(arg[3]);
// }
// jspang(1,2,3);

// let arr1 = ['wwww', 'jspang', 'com'];
// let arr2 = [...arr1];
// console.log(arr2);
// arr2.push('George');
// console.log(arr1);
// console.log(arr2);

// rest ...
function george(first) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            console.log(i);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

george(0, 1, 2, 3, 4, 5, 6, 7);
