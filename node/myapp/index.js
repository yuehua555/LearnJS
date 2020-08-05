/*
 * @Author: George Wu
 * @Date: 2020-07-27 15:40:28
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-27 16:43:26
 * @FilePath: \node\myapp\index.js
 */ 
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

let htmlStr = '';
fs.readFile('demo.html', function(err, data){
    htmlStr = data.toString();
});

app.get("/", function(req, res){
    res.end(htmlStr);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));