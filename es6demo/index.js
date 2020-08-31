/*
 * @Author: George Wu
 * @Date: 2020-08-26 16:13:14
 * @LastEditors: George Wu
 * @LastEditTime: 2020-08-31 16:48:33
 * @FilePath: \es6demo\index.js
 */
/*
// let jspang='技术胖';
// let blog = `非常高兴你能看到这篇文章，我是你的老朋友技术胖。</br>
// 这节课我们学习字符串模版。</br>`;
// document.write(blog.includes(jspang));

// let a = 1;
// let b = 2;
// let result = `</br>${a+b}</br>`;
// document.write(result);

// document.write(`jspang~`.repeat(5));

// // 二进制声明 Binary
// let binary = 0B010101;
// console.log(binary);

// // 八进制声明 0O666;
// let octal = 0o666;
// console.log(octal);

// let a = 11/4;
// console.log(Number.isFinite(a));
// console.log(Number.isFinite('JSPang'));
// console.log(Number.isFinite(NaN));
// console.log(Number.isFinite(undefined));

let a = 918.1;
console.log(Number.isInteger(a));
console.log(Number.parseInt(a));
console.log(Number.parseFloat(a));

let jspang = Math.pow(2, 53) - 1;
console.log(jspang);
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MIN_SAFE_INTEGER);
*/

// // json 数组格式
// let json = {
//     '0' : 'jspang',
//     '1' : '技术胖',
//     '2' : '大胖逼逼叨',
//     length: 3
// }

// let arr = Array.from(json);
// console.log(arr);

// // Array.of method
// let str = '1,2,3,4';
// let arr = Array.of(1,2,3,4);
// console.log(arr);

// // find 数组的实列方法
// let arr1 = [1,2,3,4,5,6,7,8,9];

// console.log(arr1.find(function(value, index, arr1){
//     return value > 5;
// }));

// 

// function add(a, b=1) {
//     return a + b;
// }
// console.log(add.length);

// var add = (a, b=1) => { 
//     console.log('jspang');
//     return a+b; 
// };
// console.log(add(1));

// 对象的函数结构 JSON
let json = {
    a: 'jspang',
    b: '技术胖'
};
function fn1 ({a, b='web'}) {
    console.log(a,b)
}
fn1(json);

// 数组结构
let arr = ['jspang', '技术胖', '前端教程'];
function fn2(a, b, c) {
    console.log(a, b, c);
}
fn2(...arr);

// in 的用法
let obj = {
    a: 'jspang',
    b: '技术胖'
};
console.log('a' in obj);

let arr2 = [,,,];
console.log(1 in arr2);

// 数组遍历 forEach filter some
let arr3 = ['jspang', '技术胖', 'George Wu'];
arr3.forEach((value, index) => console.log(index, value));
arr3.filter(x => console.log(x));
arr3.some(x => console.log(x));
console.log(arr3.map(x => 'web'));

console.log(arr3.toString());
console.log(arr3.join('|'));
