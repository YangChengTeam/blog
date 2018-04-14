"auto"
var {downloadAnswerImagesById} = require('common.js')

var options = [2, 3, 4, 5 , 6, 7, 8, 9, 10]
var s = options[dialogs.select("请选择超时系数(单位秒)", options)]
if(!s || isNaN(s) || s < 2 ){
	s = 2
}

console.show()
log("开始执行...")

var answerDir = "/storage/emulated/0/Android/data/com.v.study/files/Pictures/answer/"
var dstDir = "/storage/emulated/0/$MuMu共享文件夹/"

app.launch("com.v.study")
id("btn_bottom_2").waitFor()
id("btn_bottom_2").click()
id("search_tv").waitFor()
id("search_tv").click()

var data = files.read(dstDir + "answers.txt").trim().replace("\r", "").replace("\n", "").split("-")

if(data && data.length > 1){
	var startIndex =  parseInt(data[0])
	var endIndex =  parseInt(data[1])
	if(!isNaN(startIndex) &&  !isNaN(endIndex)){
		for(let i = startIndex ; i <= endIndex; i++){
			downloadAnswerImagesById(i)
		}
	}
}

log("执行结束。")






