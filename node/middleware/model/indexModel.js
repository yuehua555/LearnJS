/*
 * @Author: George Wu
 * @Date: 2020-07-28 15:25:50
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-28 21:19:57
 * @FilePath: \middleware\model\indexModel.js
 */
const request = require('request'); 
module.exports = function(callback) {
    request({
        url: "http://localhost:3500",
        method: "GET",
        headers: {
            "content-type": "application/json",
        }
    }, function(err, response, body){
        console.log(body);
        var data = JSON.parse(body);
        callback(data);
    });
};