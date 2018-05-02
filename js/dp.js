/*
 作者: 张凯
 时间: 2018-04-25
 定时消息钉钉机器人node版
*/

const https = require("https");
const fs = require('fs');

const later = require('later');

// 发送https请求
function send(path, params, callback){
    var gdata = [];
    const options = {
        hostname: 'oapi.dingtalk.com',
        port: 443,
        path: path,
        method: "POST",
        headers: {
           "Content-Type": "application/json",
           "Content-Length":  params.length
        }
    };
    const req = https.request(options, (res) => {
        res.on('data', (d) => {
            gdata.push(d)
        });   

        res.on('end', d => {
            if(callback){
               callback(gdata.join('').toString())
            }
        })
    })
 
    req.on('error', (e) => {
        console.error(e)
    });
    req.write(params);
    req.end()
}

// 转unicode
function toUnicode(theString) {
    var unicodeString = '';
    for (var i = 0; i < theString.length; i++) {
        var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
        while (theUnicode.length < 4) {
            theUnicode = '0' + theUnicode;
        }
        theUnicode = '\\u' + theUnicode;
        unicodeString += theUnicode;
    }
    return unicodeString;
}

// 发送钉钉消息
function dingding(hookpath, msg, callback){
	msg = `{ "msgtype": "text", "text": { "content": "${toUnicode(msg)}" }, "at": {"isAtAll": true}}`;
    console.log(msg);
	send(hookpath, msg, d=>{
		callback(d)
	})
}

// 任务
function tasks(setting){
    for(let i = 0; i < setting.length ; i++){
        let info = setting[i];
        info.tasks.forEach(data=>{
            var times = data.time.split(':');
            if(times.length < 2){
                return;
            }
            var time = new Date();
            if(info.debug || (time.getHours() == parseInt(times[0]) && time.getMinutes() == parseInt(times[1]))){
                 dingding(info.webhook, data.msg, d=>{
                     console.log(d)
                 });
            }
        })
    }
}

// main
var setting = JSON.parse(fs.readFileSync('dp.conf', 'utf8'));
let sched = later.parse.text('every 1 min')
later.setInterval(()=>{
    tasks(setting)
}, sched);





