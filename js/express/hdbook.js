const http = require('http')
const fs = require('fs')

const {to} = require('await-to-js')
const cheerio = require('cheerio')
const download = require('image-downloader')

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
   let answerImgs = []
   let imgs = $(".show_chapter img")

   for(let i = 0; i < imgs.length; i++){
       let imgUrl = $(imgs.get(i)).attr('src')
       answerImgs.push(imgUrl)
   }

   return [null, {bookName: bookName,
           coverThumbnail: coverThumbnail,
           bookVersion: bookVersion,
           bookGrade: bookGrade,
           bookSubject: bookSubject,
           bookPress: bookPress,
           answerImgs: answerImgs}]
}     



var express = require('express')
var bodyParser = require('body-parser')
var app = express();
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
});


var server = http.createServer(app);
server.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});
