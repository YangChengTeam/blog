const http = require('http')
const fs = require('fs')

const {to} = require('await-to-js')
const cheerio = require('cheerio')
const download = require('image-downloader')

function send(path){
   var data = []
   var promise = new Promise((resolve, reject)=>{
      const options = {
           hostname: 'm.cdhdky.com',
           path: path,
           method: 'GET'
      };

      const req = http.request(options, (res) => {
         const code =  res.statusCode
           if(code != 200) return

          res.on('data', (d) => {
             data.push(d)
          });

          res.on('end', ()=>{
              resolve(data.join('').toString())
          })
      });

      req.on('error', (e) => {
          reject(e)
      });

      req.end()
   })
   promise.catch(new Function())
   return promise
}

function getImageName(url){
   let sIndex = url.lastIndexOf('/') + 1
   return url.substr(sIndex, url.length - sIndex)
}

function downloadImage(imgUrl){
	let imgName = `images\\${getImageName(imgUrl)}`
    return download.image({
        url: imgUrl,
        dest: imgName   
    })
}


let types = []
async function getTypes(){
	if(types.length == 0){
		let [err, data] = await to(send(`/touxiang/list1.htm`))
		
		const $ = cheerio.load(data)
		let typeObjs = $($($(".sub_nav01 dl").get(0)).find("dd").get(0)).find("span")
		for(let i = 0 ; i < typeObjs.length ; i++){
			let url = ($(typeObjs.get(i)).find("a").attr('href'))
			let sindex = url.indexOf('touxiang/') + 9
			let name = url.substr(sindex, url.length - sindex - 1)
			types.push({
				pageindex : 1,
				name: name
			})
		}
	} 
}
async function list(type){
	// var filename = `jsons/tx-${type.name}-${type.pageindex}.json`
 	//    if (fs.existsSync(filename)) {
	// 	return
	// }
	
	let shortUrl = `list${type.pageindex}.htm`
	let url = `/touxiang/${type.name}/${shortUrl}`
	console.log(url)
	let [err, data] = await to(send((url)))	
	
	const $ = cheerio.load(data)
	let imgObjs = $(".PicList li")
	let imgDatas = []
	for(let i = 0 ; i < imgObjs.length; i++){
		 let imgUrl = $(imgObjs.get(i)).find("img").attr('src')
		 let title = $($(imgObjs.get(i)).find("a").get(1)).text()
		 imgDatas.push({
			 title: title,
			 imgUrl: imgUrl
		 })
	}
	
   //  fs.writeFile(filename, JSON.stringify(imgDatas), function(err) {
   //      if(err) {
			// console.log(err);
   //      }
   //  });
    
	
	// var lastPageObj = $(".showpage a").last()
	// if($(lastPageObj).attr('href').indexOf(shortUrl) > -1){
	// 	console.log(`${type.name}-end`)
	// 	return
	// }
	
	// type.pageindex++
	// list(type)
	return imgDatas
}

async function loop(){
	await to(getTypes())
	for(let i = 0 ; i < types.length; i++){
		await list(types[i])
	}
}

var express = require('express')
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', express.static(__dirname + '/views'))

app.get('/api/tx',async function(req, res){
    let name = req.query.type || 'qinglv'
    let pageindex = req.query.pageindex || 1
    console.log(pageindex)
    res.setHeader('Content-Type', 'application/json')
    let data = await list({
    	name: name,
    	pageindex: pageindex
    })
    res.send(data);
});


var server = http.createServer(app);
server.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});
