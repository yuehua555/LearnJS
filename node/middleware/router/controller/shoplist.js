/*
 * @Author: George Wu
 * @Date: 2020-07-28 15:24:32
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-28 17:25:56
 * @FilePath: \middleware\router\controller\shoplist.js
 */ 
const shoplistModel = require('../../model/shoplistModel.js'); 
module.exports = function(req, res) {
    shoplistModel(function(result){
        res.render('./shoplist.art', result);
    });
};