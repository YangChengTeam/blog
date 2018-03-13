const http = require('http')
const cheerio = require('cheerio')
const {to} = require('await-to-js')
const sleep = require('sleep')
const fs = require('fs')
const md5 = require('md5')
var iconv = require('iconv-lite'); 

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
          })

          res.on('end', ()=>{
              resolve(data.join('').toString())
          })
      })

      req.on('error', (e) => {
          reject(e)
      })

      req.end()
   })
   promise.catch(new Function())
   return promise
}



function downloadImage(imgUrl, imgName){
    return to(download.image({
        url: imgUrl,
        dest: imgName   
    }))
};





var pageindex = 40
var year = 2018


function getImageName(url){
   let sIndex = url.lastIndexOf('/') + 1
   let eIndex = url.indexOf('?')
   return url.substr(sIndex, eIndex - sIndex).replace('!www-book-photo-path', '')
}

async function booklist(){
    console.log(`当前位置${year}-${pageindex}`)
    let [err, data] = await to(send(`/booklist/subject_-1@grade_-1@bookVersion_-1@version_${year}@volumes_-1@keyword_@barcode_@pageIndex_${pageindex}`))
    const $ = cheerio.load(data)
    let lis = $("#list_book li")

    for(let i = 0; i < lis.length; i++){
       let url = $(lis.get(i)).find('a').attr('href')
       let [err, data] = await to(bookdetail(url))

       let coverImage = data.coverThumbnail
       let coverImgName = `互动作业/cover/${getImageName(coverImage)}`
       if (!fs.existsSync(coverImgName)) {
          console.log(coverImage)
          await downloadImage(coverImage, coverImgName)
       }
       for(let j = 0; j< data.answerImgs.length ; j++){
          let imgUrl = data.answerImgs[j]
          let imgName = `互动作业/answers/${getImageName(imgUrl)}`
          if (!fs.existsSync(imgName)) {
             console.log(imgUrl)
             await downloadImage(imgUrl, imgName)
          }
      }
       // var filename = `互动作业/answer${year}-${pageindex}-${i+1}.json`
       // if (!fs.existsSync(filename)) {
       //     fs.writeFile(filename, JSON.stringify(data), function(err) {
       //           if(err) {
       //               console.log(err);
       //           }
       //     });
       // }
    }

    let pageLis = $("#page .m-pagination-page li")
    let lastPageText = $(pageLis.last()).find("a").text()

    if(lastPageText == '末页'){
        pageindex++
        sleep.sleep(10)
        booklist(year)
    } else {
        if(year == 2018) return
        pageindex = 1
        ++year
        sleep.sleep(10)
        booklist()
    }
}

let url = ''
async function search(keyword, imageUrl){
    let [err, data] = await to(send(`/booklist/?keyword=${keyword}`))
    const $ = cheerio.load(data)
    let lis = $("#list_book li")
    let href = $(lis.get(0)).find("a").attr('href')
    if(url == href) return
    url = href
    console.log(url)
    await to(bookdetail2(url, imageUrl))
    sleep.sleep(2)
}


async function bookdetail2(url, imageUrl){
   let [err, data] = await to(send(url))

   if(err){
      return
   }
   const $ = cheerio.load(data)
   let imgs = $(".show_chapter img")

   let imgUrls = []
   for(let i = 0; i < imgs.length; i++){
       let imgUrl = $(imgs.get(i)).attr('src')
       let imgName = `answers/${getImageName(imgUrl)}`
       console.log(imgUrl)
       downloadImage(imgUrl, imgName)
   }
}

function downloadMissCoverImgs(){
  fs.readFile('book.txt',async function(err, data){
        if(!err)
           var infos = iconv.decode(data, 'gbk').split('\r\n')
           var names = new Set()
           for(let i = 0; i < infos.length ; i++){
                 let keyword = infos[i].split(' ')
                 let imgName = `answers/${getImageName(keyword[1])}`
                 if (!fs.existsSync(imgName)) {
                     names.add(imgName)
                     console.log(imgName)
                 }
           }
           console.log(names.size)

  });
}


async function bookdetail(url){
   let [err, data] = await to(send(url))

   if(err){
      return
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

   return {bookName: bookName,
           coverThumbnail: coverThumbnail,
           bookVersion: bookVersion,
           bookGrade: bookGrade,
           bookSubject: bookSubject,
           bookPress: bookPress,
           answerImgs: answerImgs}
}

             


async function bookdetail2(id){
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

   return {bookName: bookName,
           coverThumbnail: coverThumbnail,
           bookVersion: bookVersion,
           bookGrade: bookGrade,
           bookSubject: bookSubject,
           bookPress: bookPress,
           answerImgs: answerImgs}
}     

async function loop_detail(){
    let index = 174390
    while(true){
       let [err, data] = await to(bookdetail2(index))
       if(err){
          console.log(`${index}-crash error`)
          continue
       }
       let coverImage = data.coverThumbnail
       let coverImgName = `互动作业/cover/${getImageName(coverImage)}`
       if (!fs.existsSync(coverImgName)) {
          console.log(coverImage)
          await downloadImage(coverImage, coverImgName)
       }
       for(let j = 0; j< data.answerImgs.length ; j++){
          let imgUrl = data.answerImgs[j]
          let imgName = `互动作业/answers/${getImageName(imgUrl)}`
          if (!fs.existsSync(imgName)) {
             console.log(imgUrl)
             await downloadImage(imgUrl, imgName)
          }
       }
       var filename = `互动作业/answer-detail-${index}.json`
       if (!fs.existsSync(filename)) {
           fs.writeFile(filename, JSON.stringify(data), function(err) {
                 if(err) {
                     console.log(err);
                 }
           });
       }

       index++
    }
} 

loop_detail()
