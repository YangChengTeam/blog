// 检测是否已经下载到最后一个
function isLast(answerName){
	if(data[data.length - 1].indexOf(answerName) > -1){
		return true
	}
	return false
}

// 清理手机中下载的答案图片
function clearAnswerPath(answerDir){
	var dirs = files.listDir(answerDir)
	if(dirs && dirs.length > 0){
		 dirs.forEach(function(dir){
		 	 files.removeDir(answerDir + dir)
		 })
	}
}

// --------------------开始 记录已下载答案图片-------------
var logfile ="/storage/emulated/0/$MuMu共享文件夹/downloaded.txt"  
var logdata = undefined   

// 追加到日志文件
function log(logfile, answerName, answerId){
	if(!isLoged()){
		files.append(logfile, answerId + "_" + answerName + "\n")
	}
}

// 获取日志文件数据
// 存储在 全局变量logdata中
function getLogData(logfile){
	try{
		logdata = files.read(logfile).split("\n")
	}catch(e){

	}
	if(!logdata){
		logdata = []
	}

}

// 是否已经记录过
function isLoged(logfile, answerName, answerId){
	if(!logdata){
		getLogData(logfile)
	}
	for(var i = 0; i < logdata.length ; i++){
		if(logdata[i] == answerId + "_" + answerName){
			return true
		}
	}
	return false
}
// --------------------结束 记录已下载答案图片-------------


// 将下载完的答案数据拷到模拟器与PC的共享目录
function sendAnswerImages2Pc(answerDir, dstDir, answerName, answerId){
	var dstPath = dstDir + answerId + "_" + answerName
	files.listDir(answerDir).forEach(function(dir){
	 	try{
	 		var answerPath = answerDir + dir
	 		var n = 1
	 		files.listDir(answerPath).forEach(function(filename){
	 			var imagename = answerPath + "/" + filename
	 			files.copy(imagename, dstPath + "/" + (answerId) + "_" + (n++) + ".jpg")
			})
			files.removeDir(answerPath)
	 	}catch(e){
	 		log("hdzy.js->"+e)
	 	}
	})
}
 

// 模拟整个下载过程
function downloadAnswerImages(answerDir, dstDir, answerName, answerId){
	if(answerName.length == 0) return
	var dstPath = dstDir + answerId + "_" + answerName
	files.ensureDir(dstPath)

	if(isLoged(logfile, answerName, answerId)){
		console.log("已下载：" + answerName)
		return
	}

	if(files.listDir(dstPath) && files.listDir(dstPath).length > 0){
		console.log("已下载：" + answerName)
		log(logfile, answerName, answerId)
	 	return
	}
	
	clearAnswerPath(answerDir)
	console.log("准备搜索：" + answerName)
	id("search_tv").waitFor()
	id("search_tv").click()
	var result = shell("adb shell am broadcast -a ADB_INPUT_TEXT --es msg \""+ answerName +"\"", true)
	// console.log(result)
	console.log("开始搜索：" + answerName)
	id("search_barcode_tv").waitFor()
	id("search_barcode_tv").findOne().click()
	for(;true;){
		console.log("搜索中...")
		sleep(2000)
		var listParent = className("ListView").findOne()
		if(listParent && listParent.childCount() > 1 && listParent.child(1) && typeof listParent.child(1).click === "function"){
			console.log("进入详情")
			sleep(1000)
    		listParent.child(1).click()
			id("tread_ll").waitFor()
			id("tread_ll").click()
			var startTime = new Date().getTime()
			var n = 0;
			while(true){
				var textObj = id("tread_tv").findOne()
				if(textObj && textObj.text().split('/').length > 1){
					n = parseInt(textObj.text().split('/')[1])
					console.log("下载中...共" + n+"张图片，超时系数：" + s)
					break
				}
				id("tread_ll").click()
			}
			while(true){
				var textObj = id("tread_tv").findOne()
				var isOverTime = false
				if(!isNaN(n) && n > 0){
					isOverTime = (new Date().getTime() - startTime) / 1000 > n*s
				}
				if((textObj&& textObj.text() && textObj.text() == "已下载")){
					console.log("下载完毕")
					break
				}
				if(isOverTime){
					id("tread_ll").click()
					sleep(1000)
					console.log("下载超时")
					break;
				}
			}
			if(!isOverTime){
				console.log("传送到PC中...")
				sendAnswerImages2Pc(answerDir, dstDir, answerName, answerId)
				console.log("传送完毕")
				log(logfile, answerName, answerId)
			}
			
			if(isLast(answerName)){
				return
			}
			id("btn_back").findOne().click()	
			id("search_tv").waitFor()
			id("search_tv").click()
			for(var i = 0; i <= answerName.length; i++){
				shell("adb shell input keyevent 67", true)
			}
			return
		}
		id("search_tv").click()
		id("search_barcode_tv").findOne().click()
	}
}

// 下载答案信息
// 参数: answerId 
function downloadAnswerImagesById(answerId){
	try{
		var data = JSON.parse(getBookInfoById(answerId))
		if(data["code"] == 1 && data["data"]){
			var answerName = data["data"]["name"].trim()
			var count = data["data"]["answer_list"].length
			console.log("网上现有图片：" + count + "张")
			downloadAnswerImages(answerDir, dstDir, answerName, answerId, count)
		}
	}catch(e){
		console.log(e)
	}
}


// 获取书本信息
// 参数: answerId 
// 返回: bookinfo json
function getBookInfoById(answerId){
	var url = 'https://answer.bshu.com/v1/book/answer'
	return http.post(url, {
    	"book_id": answerId,
	}).body.string();
}

// 更新数据库答案信息[暂无接口]
function updateAnswerImages(answerId, count){
	var url = 'https://answer.bshu.com/v1/book/answer'
	return http.post(url, {
    	"book_id": answerId,
    	"count": count
	}).body.string();
}

module.exports = {
	downloadAnswerImages: downloadAnswerImages,
	downloadAnswerImagesById: downloadAnswerImagesById	
}