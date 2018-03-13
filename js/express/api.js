const https = require('https');

function send(path, callback){
    const options = {
  		  hostname: 'qmsq.7dar.com',
  		  port: 443,
  		  path: path,
  		  method: 'GET'
	 }

	const req = https.request(options, (res) => {
 		  const code =  res.statusCode;
  		if(code != 200) return;

  		res.on('data', (d) => {
          if(callback){
              callback(d);
          }   
  	  })
	})

	req.on('error', (e) => {
  		if(callback){
           callback(e);
      }   
	});
	req.end();
}

function random_id(n) {
	  const str='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
	  var cs = '';
	  while(n-- > 0){
		    cs += str.substr(Math.random()*str.length, 1);
	  }
	  return cs;
}

function getnamesgroup(params, callback){
	  let {lastname, sex, double, mode, birthdaydate, birthdaytime, curpage, size} = params;
    lastname = encodeURIComponent(lastname);
    birthdaytime = encodeURIComponent(birthdaytime);
    openid = random_id(28);
    unionid = random_id(28);
	  let path = `/getnamesgroup?lastname=${lastname}&sex=${sex}&double=${double}&mode=${mode}&birthdaydate=${birthdaydate}&birthdaytime=${birthdaytime}&openid=${openid}&unionid=${unionid}&curpage=${curpage}&nickname=%20&size=${size}`;
	  send(path, callback);
}

function reviewname(params, callback){
	  let {nameid, firstname, lastname, sex, double, mode, birthdaydate, birthdaytime, curpage, size, refreshCount} = params;
    lastname = encodeURIComponent(lastname);
    firstname = encodeURIComponent(firstname);
    birthdaytime = encodeURIComponent(birthdaytime);
    openid = random_id(28);
    unionid = random_id(28);
	  let path = `/reviewname?nameid=${nameid}&firstname=${firstname}&refreshCount=${refreshCount}&lastname=${lastname}&sex=${sex}&double=${double}&mode=${mode}&birthdaydate=${birthdaydate}&birthdaytime=${birthdaytime}&openid=${openid}&unionid=${unionid}&curpage=${curpage}&nickname=%20&size=${size}`;
    console.log(path);
    send(path, callback);
}


var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', express.static(__dirname + '/views'));

var fs = require('fs');
var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

app.post('/api/reviewname', function(req, res){
    var params = {}
    console.log(req.body);
    params.lastname = req.body.lastname;
    params.firstname = req.body.firstname;
    params.nameid = 12;
    params.refreshCount = 0;
    params.curpage = 0;
    params.size = 10;
    params.sex = req.body.sex;
    params.mode = 1;
    params.double = 2;
    params.birthdaydate = req.body.birthdaydate;
    params.birthdaytime = req.body.birthdaytime;
    reviewname(params, d=>{
        res.setHeader('Content-Type', 'application/json');
        res.send(d);
    }); 
});

var server = https.createServer(options, app);
server.listen(8443, function() {
    console.log('Listening on port %d', server.address().port);
});







