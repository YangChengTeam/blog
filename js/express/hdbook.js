const http = require('http')
const fs = require('fs')

const {to} = require('await-to-js')
const cheerio = require('cheerio')
const download = require('image-downloader')
const md5 = require('md5')

function send(path){
   var data = []
   var promise = new Promise((resolve, reject)=>{
      const options = {
           hostname: 'www.hdzuoye.com',
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

async function bookdetail(id){
   let [err, data] = await to(send(`/detail/${id}`))
   

   if(err){
      return [err, null]
   }

   const $ = cheerio.load(data)
   let bookName = $('.bookName').text()
   let coverThumbnail = $(".coverThumbnail").attr('src')
   let bookVersion = $(".bookVersion").text()
   let bookGrade = $(".bookGrade").text()
   let bookSubject = $(".bookSubject").text()
   let bookPress = $($(".de2 ul li").get(3)).text()
    
   let answers = []
   let types = $("#bookChapter div")
   let imgs = $("#answer_div div")

   for(let i = 0; i < types.length; i++){
       let type = $(types.get(i)).text()
       let imgUrls = $(imgs.get(i)).find("img")
       var answerImgs = []
       for(var j = 0; j < imgUrls.length; j++){
           let imgUrl = $(imgUrls.get(j)).attr('src')
           answerImgs.push(imgUrl)
       }

       answers.push({
          title: type,
          imgs: answerImgs
       })
   }

   return [null, {bookName: bookName,
           coverThumbnail: coverThumbnail,
           bookVersion: bookVersion,
           bookGrade: bookGrade,
           bookSubject: bookSubject,
           bookPress: bookPress,
           answers: answers}]
}     


function getCdnUrl(url, offset = 5000){
   let ipImage = 'http://authimage.hdzuoye.com'
   let timestamp = parseInt((new Date()).getTime() / 1000) + offset
   let path = url.split('?')
   let path2 = path[0].split(ipImage)
   if(path2.length < 2){
       path = ipImage + path
       path2[1] = url
   }
   return path[0] + `?auth_key=${timestamp}-0-0-` + md5(`${path2[1]}-${timestamp}-0-0-burglar88372`)
}

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', express.static(__dirname + '/views'))

app.get('/api/detail',async function(req, res){
    let id = req.query.id
    res.setHeader('Content-Type', 'application/json')
    let [err, data] = await bookdetail(id)
    if(err){
    	res.send(err)
    } else {
    	res.send(data)
    }
})


app.get('/api/getCdnUrl',async function(req, res){
    let url = req.query.url
    res.setHeader('Content-Type', 'application/json')
    res.send(getCdnUrl(url))
})

const sharp = require('sharp')
console.log(sharp)

app.get('/image', (req, res)=>{
    res.setHeader('Content-Type', 'image/jpeg')
    const watermark = new Buffer(`<svg width='512' height='512'>
    <text x="10" y="76" font-size="14" >abcd</text>
  </svg>`)
    var png = sharp('appyb.png')
    .overlayWith(watermark, { cutout: false })
    .png().toFile('output.webp', (err, info) => {});
    res.send(png)
})




var server = http.createServer(app);
server.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});
