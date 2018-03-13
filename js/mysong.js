const https = require('https');
const fs = require('fs');
const querystring = require('querystring');                                                                                                                                                                                                
var options;

function send(path, params, callback){
   var gdata = [];
   options = {
      hostname: 'cg.bshu.com',
      port: 443,
      path: path,
      method: 'POST',
      headers:  {
        'Referer':'https://servicewechat.com/wx275b579fe557bf5c/4/page-frame.html',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': querystring.stringify(params).length
    }
  };

  const req = https.request(options, (res) => {
    const code =  res.statusCode;
      if(code != 200) return;

      res.on('data', (d) => {

          gdata.push(d);
      });

      res.on('end', (d) => {
          if(callback){
              callback(gdata.join('').toString());
          }
      });
  });

  req.on('error', (e) => {
      console.error(e);
  });
  req.write(querystring.stringify(params));
  req.end();
}




//https://brand.7759.com/api/Activity/getNewQustions.html
//https://brand.7759.com/api/Activity/NewExamineBrand.html

// phpsessid q5a61d992svseskfi4t62t44l2
// uid 0
// qid 0
// formid  421f8a2d3e8514581186a1802a01c1c3

function info(music_id, callback){
    var params = {
       user_id: 28,
       music_id: music_id,
       type_id: 1
    }
    send('/api/music/info',  params, callback);
}

var music_id = 1
function loop(){
   info(music_id++, d=>{
        var obj = JSON.parse(d)
        if(obj.code != 1) return
        var name = obj.data.music_info.name;

        var filename = `names.json`;
        fs.appendFile(filename, "," + name, function(err) {
                 if(err) {
                     console.log(err);
                 }
        });
        loop()
   });

}
loop()

