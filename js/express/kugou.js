const http = require('http');

function send(host, path, callback){
    const options = {
        hostname: host,
        path: path,
        method: 'GET'
   };
   const data = [];
   const req = http.request(options, (res) => {
      const code =  res.statusCode;
      if(code != 200) return;

      res.on('data', (d) => {
          data.push(d);
      });

      res.on('end', (d) => {
          if(callback){
              callback(data.join('').toString());
          }  
      })
  });

  req.on('error', (e) => {
      if(callback){
           callback(e);
      }   
  });
  req.end();
}

function search(keyword, page, callback){
     var enkeyword = encodeURIComponent(keyword);
     var path = `/api/v3/search/song?tag=1&tagtype=%E5%85%A8%E9%83%A8&area_code=1&highlight=em&plat=0&sver=5&api_ver=1&showtype=14&tag_aggr=1&version=8942&keyword=${enkeyword}E&correct=1&page=${page}&pagesize=30&with_res_tag=1`;
     send('mobilecdngz.kugou.com', path, d => {
        if(typeof d.replace != 'function') return;
        d = d.replace("<!--KG_TAG_RES_START-->", "").replace("<!--KG_TAG_RES_END-->", "");
        callback(d);
    });
}



//let sqhash = data["data"]["info"][1]["sqhash"];
function vip(sqhash, callback){
    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    var key = md5.update(sqhash + "kgcloud").digest('hex');
    send('trackercdn.kugou.com', `/i/?cmd=4&hash=${sqhash}&key=${key}&pid=1&forceDown=0&vip=1`, d => {
         callback(d);
    });
}

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', express.static(__dirname + '/views'));

app.post('/api/search', function(req, res){
    var params = {}
    console.log(req.body);
    keyword = req.body.keyword;
    page = req.body.page;
    search(keyword, page,  d=>{
        res.setHeader('Content-Type', 'application/json');
        res.send(d);
    });
});

app.post('/api/download', function(req, res){
    var params = {}
    console.log(req.body);
    sqhash = req.body.sqhash;
    console.log(sqhash);

    vip(sqhash, d => {
        res.setHeader('Content-Type', 'application/json');
        res.send(d);
    });
});

var server = http.createServer(app);
server.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});



