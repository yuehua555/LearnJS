/*
 * @Author: George Wu
 * @Date: 2020-08-26 16:13:14
 * @LastEditors: George Wu
 * @LastEditTime: 2020-08-26 16:24:54
 * @FilePath: \es6demo\index.js
 */
let jspang='技术胖';
let blog = `非常高兴你能看到这篇文章，我是你的老朋友技术胖。</br>
这节课我们学习字符串模版。</br>`;
document.write(blog.includes(jspang));

let a = 1;
let b = 2;
let result = `</br>${a+b}</br>`;
document.write(result);

document.write(`jspang~`.repeat(5));