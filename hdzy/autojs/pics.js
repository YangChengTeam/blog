const fs = require("fs")
const md5File = require('md5-file')
var path = process.argv[2]
var files = fs.readdirSync(path)
files.forEach(function(file){
	let tmp = path + file
	if(fs.lstatSync(tmp).isDirectory() && file.indexOf("node_modules") == -1){
		var imgs = fs.readdirSync(tmp)
		if(imgs && imgs.length > 2){
			const hash1 = md5File.sync(tmp + "/1.jpg")
			const hash2 = md5File.sync(tmp + "/2.jpg")
			if(hash1 == hash2){
				for(let i = 1; i < imgs.length ; i++){
					fs.renameSync(`${tmp}/${(i+1)}.jpg`, `${tmp}/${i}.jpg`)
				}
				console.log("I:"+tmp)
			}

		}
	}
})
console.log("执行完毕")	