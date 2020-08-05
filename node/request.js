/*
 * @Author: George Wu
 * @Date: 2020-07-26 20:19:14
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-27 13:49:46
 * @FilePath: \node\request.js
 */ 

// post request
const http = require('http');
const queryString = require('querystring');
const postdata = JSON.stringify({
    "data": 123,
    "data2": "test"
});
console.log(postdata, typeof postdata);
var opt = {
    method: 'POST',
    hostname: '127.0.0.1',
    port: 10000,
    path: '/postAPI',
    header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Content-Length': postdata.length
    }
};

var callback = function(response){
    var body = '';
    response.on('data', function(data) {
       body += data;
    });
    
    response.on('end', function() {
       console.log(body);
    });
 }
var req = http.request(opt, callback);
req.write(postdata);
req.end();

// get request
var getOpt = {
    method: 'GET',
    host: 'localhost',
    port: 10000,
    path: '/a',
    header: {} 
};

req = http.request(getOpt, callback);
req.end();
