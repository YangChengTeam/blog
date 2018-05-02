const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const replace = require("replace");

const apkResoucreName="app-release.apk"; //资源APK名称
let outputApkResPath = "xinqu";  //APK包解压输出路径
const fix_xml = "abc_screen_toolbar.xml"
var isCopyLayout=false;

function startTask(){
	let result = fs.existsSync(outputApkResPath);
	if(result){
		console.log("I：1");
		start();
	} else {
		console.log("I：2");
		exec(`java -jar apktool_2.3.2.jar d ${apkResoucreName} -f -o ${outputApkResPath}`, (err, stdout, stderr) => {
		  if (err) {
		    console.error(err);
		    return;
		  }
		  //备份原始的strings.xml文件和Mamifest.xml文件，在单个打包任务结束后还原
		  console.log("I：2.1");
		  fs.copyFileSync(path.join(outputApkResPath, 'AndroidManifest.xml'), path.join(__dirname, 'AndroidManifest.xml'));
		  fs.copyFileSync(path.join(outputApkResPath, 'res','values','strings.xml'), path.join(__dirname, 'strings.xml'));
		  start();
		});
	}
}

//同步打包
async function start(){
	console.log("I：3");
	let configFile="config.json";
	let configJson=JSON.parse(fs.readFileSync(configFile));
	for (var i = 0; i < configJson.data.length; i++) {
		console.log("开始执行:"+configJson.data[i].name);
		try{
			let result=await subTask(configJson.data[i]);
			console.log(result)
		}catch(res){
			console.log(res);
		}	
	}
	console.log("全部打包完毕")
	//删除备份文件
	fs.unlinkSync("AndroidManifest.xml");
	fs.unlinkSync("strings.xml");
}

const subTask = function(info){
	 return new Promise(function (resolve, reject) {
       let appZipName = info.name + "_zip"; //APK压缩包名称
	   let appSingerDir = info.name + "_singer"; //最终的输出文件
	   //替换渠道
	   replace({
				  regex: "app_xinqu",
				  replacement: info.channel,
				  paths: [path.join(outputApkResPath, 'AndroidManifest.xml')],
				  recursive: true,
				  silent: true,
		});
	   //替换APP名称
	   replace({
				  regex: "新趣小视频",
				  replacement: info.name,
				  paths: [path.join(outputApkResPath, 'res', 'values', 'strings.xml')],
				  recursive: true,
				  silent: true,
		});
	 	console.log("I: 4")

	 	fs.copyFileSync(path.join(__dirname, info.icon), path.join(outputApkResPath, 'res', 'drawable-hdpi', 'ic_launcher.png'));
	 	fs.copyFileSync(path.join(__dirname, info.icon), path.join(outputApkResPath, 'res', 'drawable-xhdpi', 'ic_launcher.png'));
	 	fs.copyFileSync(path.join(__dirname, info.icon), path.join(outputApkResPath, 'res', 'drawable-xxhdpi', 'ic_launcher.png'));
	 	fs.copyFileSync(path.join(__dirname, info.icon), path.join(outputApkResPath, 'res', 'drawable-xxxhdpi', 'ic_launcher.png'));
	 	if(!isCopyLayout){
			fs.copyFileSync(path.join(__dirname, fix_xml), path.join(outputApkResPath, 'res', 'layout-v26', 'abc_screen_toolbar.xml'));
			isCopyLayout=true;
	 	}	
	 	console.log("I: 5")
	 	exec(`java -jar apktool_2.3.2.jar b ${outputApkResPath} -f -o ${appZipName}.apk`, (err, stdout, stderr) => {
	 		if(err){
	 			console.error(err);
	 			resolve("打包失败，APP名称："+info.name);
	 			return;
	 		}
	 		console.log("I: 6")
	 		exec(`jarsigner -verbose -keystore newqu.keystore -signedjar  ${appSingerDir}.apk ${appZipName}.apk newqu -storepass 123456`,(err,stdout,stderr)=>{
	 			if(err){
	 				console.error(err);
	 				return
	 			}
	 			//删除临时的APK包
	 			fs.unlinkSync(appZipName+".apk");
	 			//还原备份的文件
	 			if(fs.existsSync('AndroidManifest.xml')){
	 				console.log("I: 7")
	 				fs.copyFileSync(path.join(__dirname, 'AndroidManifest.xml'),path.join(outputApkResPath, 'AndroidManifest.xml'));
		  			fs.copyFileSync( path.join(__dirname, 'strings.xml'),path.join(outputApkResPath, 'res','values','strings.xml'));
	 			}
	 		 	resolve("打包完成，APP名称："+info.name);
	 		})
	 	})
    })
}

//开始任务
startTask()