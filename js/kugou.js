const http = require('http');

function send(path, callback){
    const options = {
  		  hostname: 'mobilecdn.kugou.com',
  		  path: path,
  		  method: 'GET'
	 };

	const req = http.request(options, (res) => {
 		  const code =  res.statusCode;
  		if(code != 200) return;

  		res.on('data', (d) => {
          if(callback){
              callback(d);
          }   
  	  });
	});

	req.on('error', (e) => {
  		if(callback){
           callback(e);
      }   
	});
	req.end();
}


send("/api/v3/search/song?format=json&keyword=刘德华&page=1&pagesize=30", d => {
    console.log(d);
});