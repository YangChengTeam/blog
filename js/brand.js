const https = require('https');
const querystring = require('querystring');                                                                                                                                                                                                
var options;

function send(path, params, callback){
   var gdata = [];
   options = {
  		hostname: 'brand.7759.com',
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

function question(callback){
    var params = {
       uid: 0,
       qid: 0,
       phpsessid: 'att2ralatrjkjqkqadq4en9825',
       formid: '046a80e4994a96dd20cc405adc870e05'
    }
    send('/api/Activity/getNewQustions.html',  params, callback);
}


// phpsessid q5a61d992svseskfi4t62t44l2
// title 戴尔
// id  1
// uid 0

function answer(ans, id, callback){
    var params = {
       title: ans,
       phpsessid: 'att2ralatrjkjqkqadq4en9825',
       id: id,
       uid: 0
    }
    send('/api/Activity/NewExamineBrand.html',  params, callback);
}

function loop(){
   question(d=>{
      var data = JSON.parse(d);
      if(data['Status'] && data['Status'] != 200 ) {loop(); return;}
      var id = data['Result']['Id'];
      var ans = data['Result']['Title'];
      answer(ans, id, d => {
          console.log(d);
          loop();
      });
   });
}
loop();
