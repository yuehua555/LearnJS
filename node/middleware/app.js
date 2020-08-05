/*
 * @Author: George Wu
 * @Date: 2020-07-27 22:35:57
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-28 20:26:06
 * @FilePath: \middleware\app.js
 */ 
const express = require('express');
const app = express();
const router = require("./router");
app.use(express.static('./static'));
app.engine('art', require('express-art-template'));
app.set('views', './views');
app.use("/", router);
app.listen(3300);