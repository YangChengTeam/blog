var https=require('https');
var ws=require('ws');
var fs=require('fs');
var keypath=process.cwd()+'/server.key';//我把秘钥文件放在运行命令的目录下测试
var certpath=process.cwd()+'/server.crt';//console.log(keypath);
//console.log(certpath);
 
var options = {
  key: fs.readFileSync(keypath),
  cert: fs.readFileSync(certpath)
};
 
var server=https.createServer(options, function (req, res) {//要是单纯的https连接的话就会返回这个东西
    res.writeHead(403);//403即可
    res.end("This is a  WebSockets server!\n");
}).listen(25550);
 
var wss = new ws.Server( { server: server } );
//把创建好的https服务器丢进websocket的创建函数里，ws会用这个服务器来创建wss服务
//同样，如果丢进去的是个http服务的话那么创建出来的还是无加密的ws服务
const WebSocket = require('ws');

const ws = new WebSocket('ws://www.host.com/path');

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(data) {
  console.log(data);
});


