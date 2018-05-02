/**
作者: 张凯

*/
const fs   = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const redis = require("redis");
const {to} = require('await-to-js')


// 入口
function main(){
	client = redis.createClient();

	client.on('ready',async function() {
	 	await loop();
	});

	client.on("error", function (err) {
	    console.log("Redis error:" + err);
	});
}

// 循环执行任务
async function loop(){
	let [err, data] = await to(lpop());
	if(data){
		console.log(data);
		await task(data);
	}
    setTimeout(()=>{
    	console.log("I: loop循环执行")
    	loop();
    }, 1000*1)
}

// 取首条记录并删除
function lpop(){
	let promise = new Promise((resolve, reject)=>{
		client.lpop("app_list", function(err, value){
   			if(err) {
   				reject(err);
   			} else {
   				resolve(value);
   			}
   		});
	});
	promise.catch(new Function);
	return promise;
}

// 执行打包任务
async function task(info){
	info = JSON.parse(info)
	if(!isPkged(info)){
	    await run(info)
	} else {
		console.log(`I: ${info.app_name}已打包（跳过）`)
	}
}

// 运行打包任务
function run(info){
	var promise = new Promise((resolve, reject)=>{
		let cmd = `sh auto.sh ${info.apk_path} ${info.app_name} ${info.icon_path} ${info.apk_name} ${info.type}`;
		console.log(cmd);
		let start = new Date().getTime();
	    console.log("开始打包...")
		exec(cmd, function (error, stdout, stderr) {
  			if (!error) {
   				resolve(stdout);
   				console.log(`${stdout}`);
   				let timestamp = (new Date().getTime()) - start;
	   			console.log(`${info.app_name}打包耗时:` + time(timestamp));
 			} else {
 				console.log(`E: ${error}`);
                reject(error);
 			}
		});
	});
	promise.catch(new Function);
	return promise;
}

// 打包耗时计算
function time(timestamp){
	var minutes = parseInt(timestamp / 1000 / 60);
	var seconds = parseInt(timestamp / 1000);
	if(seconds == 0){
		seconds = `0${seconds}`;
	}
	return `0${minutes}:${seconds}`
}

// 是否已打包
function isPkged(info){
    if (fs.existsSync(path.join(info.apk_name, "dypkg")) || fs.existsSync(path.join(info.apk_name, "apk")) || fs.existsSync(info.apk_path)) {
    	return true;
	}
	return false;
}


main();

