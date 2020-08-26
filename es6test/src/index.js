/*
 * @Author: George Wu
 * @Date: 2020-08-23 22:48:27
 * @LastEditors: George Wu
 * @LastEditTime: 2020-08-26 16:11:37
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
function george(first, ...args){
    for(let i of args){
        console.log(i);
    }
}

george(0,1,2,3,4,5,6,7);