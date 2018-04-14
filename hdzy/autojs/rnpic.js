const fs = require("fs")
const path = require("path")
const md5File = require('md5-file')

var pwd = '.'
if(process.argv.length > 2){
	pwd = process.argv[2]
}

const files = fs.readdirSync(path.join(pwd))

files.forEach(function(file){
	let dir = path.join(pwd, file)
	if(fs.lstatSync(dir).isDirectory() && file.indexOf("node_modules") == -1){
		var imgs = fs.readdirSync(dir)
		var id = 0

		if(file.split('_').length > 1){
			id = parseInt(dir.split('_')[0])
		}
		
		if(isNaN(id) || id == 0){
			return
		}

		if(imgs && imgs.length > 2) {
			try {
				const hash = md5File.sync(path.join(dir, `${id}_1.jpg`))
				const hash2 = md5File.sync(path.join(dir, `${id}_2.jpg`))
				if(hash == hash2){
					for(let i = 1; i < imgs.length ; i++){
						fs.renameSync(path.join(dir, `${id}_${(i+1)}.jpg`), path.join(dir, `${id}_${(i)}.jpg`))
					}
					console.log("Fix:" + dir)
				}
			} catch(e){
				
			}
		}
	}
})
console.log("执行完毕")