/*
 * @Author: George Wu
 * @Date: 2020-07-28 15:12:23
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-28 15:24:09
 * @FilePath: \middleware\router\controller\index.js
 */
const indexModel = require('../../model/indexModel.js'); 
module.exports = function(req, res) {
    indexModel(function(result){
        res.render('./index.art', result);
    });
};