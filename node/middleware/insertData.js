/*
 * @Author: George Wu
 * @Date: 2020-07-28 20:48:53
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-28 20:58:42
 * @FilePath: \middleware\insertData.js
 */ 
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/*
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var myobj = { all: "12345", money: "1234567" };
    dbo.collection("site").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        db.close();
    });
});
*/

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var myobj =  [
        { shopName: '飞机', price: '12345', type: 'cn'},
        { shopName: 'computer', price: '111', type: 'en'}
       ];
    dbo.collection("site").insertMany(myobj, function(err, res) {
        if (err) throw err;
        console.log("插入的文档数量为: " + res.insertedCount);
        db.close();
    });
});