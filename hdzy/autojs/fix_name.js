const fs = require("fs")
const path = require("path")

var pwd = '.'
if(process.argv.length > 2){
	pwd = process.argv[2]
}

const files = fs.readdirSync(path.join(pwd))

files.forEach(function(file){
	let dir = path.join(pwd, file)
	if(fs.lstatSync(dir).isDirectory() && file.indexOf("node_modules") == -1){
		var id = 0
		if(file.split('_').length > 1){
			id = parseInt(file.split('_')[1])
		}
		if(isNaN(id) || id == 0){
			return
		}
		fs.renameSync(dir, path.join(pwd, file.split('_')[1] +"_"+ file.split('_')[0]))
	}
})

console.log("执行完毕")