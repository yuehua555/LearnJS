/*
 * @Author: George Wu
 * @Date: 2020-07-28 15:30:00
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-28 17:21:41
 * @FilePath: \middleware\model\shoplistModel.js
 */ 
const request = require('request'); 
module.exports = function(callback) {
    request({
        url: "http://localhost:3500/a",
        method: "GET",
        headers: {
            "content-type": "application/json",
        }
    }, function(err, response, body){
        var data = JSON.parse(body);
        callback(data);
    });
};