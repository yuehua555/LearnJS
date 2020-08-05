/*
 * @Author: George Wu
 * @Date: 2020-07-28 15:34:16
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-29 15:24:02
 * @FilePath: \middleware\server.js
 */ 
const express = require('express');
const app = express();
const port = 3500;

app.all('*', function(req, res, next){
    res.header('Access-Control-Allow-Orign', "*");
    res.header('Access-Control-Allow-Headers', "X-Requested-with,Content-Type");
    res.header('Access-Control-Allow-Methods', "PUT,POST,GET");
    next();
});

app.get("/", function(req, res){
    // var data = JSON.stringify({
    //     all: "12345",
    //     money: "1234567"
    // });
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    var data;
 
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("runoob");
        var whereStr = {"all":'12345'};  // 查询条件
        dbo.collection("site"). find(whereStr).toArray(function(err, result) { // 返回集合中数据
            if (err) throw err;
            console.log(result[0]);
            var {all, money} = {all: result[0].all, money: result[0].money};
            console.log(all, typeof all);
            console.log(money, typeof money);
            data = JSON.stringify({
                all: all,
                money: money
            });
            console.log("data in db: " + data);
            res.send(data);
            db.close();
        });
    });
    console.log(data);
    //res.send(data);
});

app.get('/a', function(req, res){
    // var data = JSON.stringify({
    //    shop: [
    //        {
    //            shopName: "飞机",
    //            price: "1234"
    //        },
    //        {
    //            shopName: '电脑',
    //            price: '111'
    //        }
    //    ]
    // });
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    var data;
 
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("runoob");
        var whereStr = "{shopName: 1, price: 1}";  // 查询条件
        dbo.collection("site"). find({}).toArray(function(err, result) { // 返回集合中数据
            if (err) throw err;
            console.log(result);
            let shop = [];
            for (let i = 0, len = result.length; i < len; i++) {
                if (result[i].shopName) {
                    let temp = {shopName: result[i].shopName, price: result[i].price };
                    shop.push(temp);
                }
            }
            data = JSON.stringify({shop: shop});
            // console.log(result[0]);
            // var {all, money} = {all: result[0].all, money: result[0].money};
            // console.log(all, typeof all);
            // console.log(money, typeof money);
            // data = JSON.stringify({
            //     all: all,
            //     money: money
            // });
            console.log("data in db: " + data);
            res.send(data);
            db.close();
        });
    });
    console.log(data);
    //res.send(data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
