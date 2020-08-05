/*
 * @Author: George Wu
 * @Date: 2020-07-26 15:43:35
 * @LastEditors: George Wu
 * @LastEditTime: 2020-07-27 13:52:17
 * @FilePath: \node\code.js
 */ 
const http = require('http');
const url = require('url');
var server = http.createServer(function(req, res) {
    const urlinfo = url.parse(req.url, true);
    const pathname = urlinfo.pathname;
    //console.log(pathname);
    res.setHeader('Access-Control-Allow-Orign', "*");
    res.setHeader('Access-Control-Allow-Headers', "X-Requested-with,Content-Type");
    res.setHeader('Access-Control-Allow-Methods', "PUT,POST,GET");
    switch(pathname) {
        case "/":
            res.end('this is the index');
            break;
        case "/a":
            res.end('this is the page a.');
            console.log('access page a');
            break;
        case "/postAPI":
            var body = "";
            req.on('data', function(chunk){
                //console.log('chunk: ' + chunk);
                body += chunk;
                console.log('body: ' + body);
            });
            
            req.on('end', function() {
                res.end('You give me ' + body.toString());
            });
            //console.log('postAPI: ' + body);
            break;
        default:
            res.end('404');
            break;
    }
});
server.listen(10000);
