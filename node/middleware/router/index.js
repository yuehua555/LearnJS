/*
 * @Author: George Wu
 * @Date: 2020-07-27 22:36:09
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-28 17:24:49
 * @FilePath: \middleware\router\index.js
 */ 
const express = require('express');
const router = express.Router();
const index = require("./controller/index.js");
const shoplist = require("./controller/shoplist.js");
router.get("/", index);
router.get("/shoplist", shoplist);
module.exports = router;