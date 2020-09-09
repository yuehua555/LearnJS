/*
 * @Author: George Wu
 * @Date: 2020-08-26 16:13:14
 * @LastEditors: George Wu
 * @LastEditTime: 2020-09-09 15:40:25
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

// // 对象的函数结构 JSON
// let json = {
//     a: 'jspang',
//     b: '技术胖'
// };
// function fn1 ({a, b='web'}) {
//     console.log(a,b)
// }
// fn1(json);

// // 数组结构
// let arr = ['jspang', '技术胖', '前端教程'];
// function fn2(a, b, c) {
//     console.log(a, b, c);
// }
// fn2(...arr);

// // in 的用法
// let obj = {
//     a: 'jspang',
//     b: '技术胖'
// };
// console.log('a' in obj);

// let arr2 = [,,,];
// console.log(1 in arr2);

// // 数组遍历 forEach filter some
// let arr3 = ['jspang', '技术胖', 'George Wu'];
// arr3.forEach((value, index) => console.log(index, value));
// arr3.filter(x => console.log(x));
// arr3.some(x => console.log(x));
// console.log(arr3.map(x => 'web'));

// console.log(arr3.toString());
// console.log(arr3.join('|'));

// let name = 'jspang';
// let skill = 'web';
// let obj = {name, skill};
// console.log(obj);

// // key值的构建
// let key = 'skill';
// let obj1 = {
//     [key]: 'web'
// }
// console.log(obj1);

// // 自定义对象的方法
// let obj2 = {
//     add: function(a, b) {
//         return a+b;
//     }
// };
// console.log(obj2.add(1, 2));

// // is()
// let obj3 = {name: 'jspang'};
// let obj4 = {name: 'jspang'};
// console.log(obj3.name === obj4.name);
// console.log(Object.is(obj3.name, obj4.name));

// console.log(+0===-0);
// console.log(NaN===NaN);

// console.log(Object.is(+0, -0));
// console.log(Object.is(NaN, NaN));

// // assign
// let a = {a: 'jspang'};
// let b = {b: '技术胖'};
// let c = {c: 'web'};
// let d = Object.assign(a, b, c);
// console.log(d);

// Symbol
// let jspang = Symbol();
// let obj = {
//     [jspang]: '技术胖'
// };
// console.log(obj[jspang]);
// obj[jspang] = 'web';
// console.log(obj[jspang]);
// let obj = {name: 'jspang', skill: 'web'};
// let age = Symbol();
// obj[age] = 18;
// console.log(obj);
// for (let item in obj) {
//     console.log(obj[item]);
// }
// console.log(obj[age]);

// // Set
// let setArr = new Set(['jspang', '技术胖', 'web']);
// setArr.add('前端');
// console.log(setArr);
// console.log(setArr.has('jspang'));
// for (let item of setArr) {
//     console.log(item);
// }
// setArr.forEach((value) => console.log(value));
// console.log(setArr.size);

// let weakSet = new WeakSet();
// let obj = {
//     a: 'jspang', 
//     b: '技术胖'};
// let obj1 = {
//     a: 'jspang', 
//     b: '技术胖'
// };
// weakSet.add(obj);
// weakSet.add(obj1);
// console.log(weakSet);

// // map =>
// let json = {
//     name: 'jspang',
//     skill: 'web'
// };
// console.log(json.name);
// let map = new Map();
// map.set(json, 'iam');
// map.get(json)
// map.set('jspang', json);
// console.log(map);
// // add delete query
// console.log(map.get(json));
// map.delete(json);
// console.log(map);
// console.log(map.size);
// console.log(map.has('jspang1'));


// // proxy 代理 ES6 增强 对象和函数（方法） 生命周期 预处理
// let obj = {
//     add: function(val) {
//         return val + 100;
//     },
//     name: 'I am Jspang'
// };
// console.log(obj.add(100));
// console.log(obj.name);

// let proxy = new Proxy({
//     add: function(val) {
//         return val + 100;
//     },
//     name: 'I am Jspang' 
// }, {
//     // get set apply
//     get: function(target, key, property) {
//         console.log('come in get');
//         console.log(target);
//         return target[key];
//     },
//     set: function(target, key, value, receiver){
//         console.log(` setting ${key} = ${value} `);
//         return target[key] = value + 0;
//     }
// });

// console.log(proxy.name);
// proxy.name = '技术胖';
// console.log(proxy.name);

let target = function(){
    return 'I am JSPang';
};
let handler = {
    apply(target, ctx, args) {
        console.log('do apply');
        return Reflect.apply(...arguments);
    }
};

let proxy = new Proxy(target, handler);

console.log(proxy());




