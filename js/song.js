const https = require('https');
const fs = require('fs');
const sleep = require('sleep');

function send(path, callback){
  var gdata = [];
  const options = {
      hostname: 'api.zuiqiangyingyu.net',
      port: 443,
      path: path,
      method: 'GET'
  };

  const req = https.request(options, (res) => {
      const code =  res.statusCode;
      if(code != 200) return;

      res.on('data', (d) => {
              gdata.push(d);
      });   

      res.on('end', d => {
          if(callback){
               callback(gdata.join('').toString());
          }
      });   
  });
 
  req.on('error', (e) => {
      console.error(e);
  });
  req.end();
}



function getsong(callback){
    let path = `/index.php/api/guess_v2/Index?token=480fe1994dfe184538a09f4e9060101a&&user_id=18290043&wechat_type=wechat_song`;
    send(path, callback);
}


function help_getsong(id, pass, callback){
    let path = `/index.php/api/guess_v2/Index?token=6726f7ac90cfceefd1cf172f5c2f1deb&user_id=18290043&wechat_type=wechat_song&pass=${pass}&uid2=21053020&sid=${id}`;
    send(path, callback);
}


function help_answer(ans, id, pass, callback){
    let path = `/index.php/api/guess_v2/Sub?answer=${ans}&wechat_type=wechat_song&token=6726f7ac90cfceefd1cf172f5c2f1deb&sid=${id}&user_id=18290043&pass=${pass}&uid2=21053020`;
    send(path, callback);
}

function share(id, callback){
    let path = `/index.php/api/guess_v2/Share?wechat_type=wechat_song&token=480fe1994dfe184538a09f4e9060101a&uid=21053020&type=help&sid=${id}`;
    send(path, callback);
}

function answer(ans, id, callback){
    let path = `/index.php/api/guess_v2/Sub?answer=${ans}&wechat_type=wechat_song&user_id=21053020&token=480fe1994dfe184538a09f4e9060101a&sid=${id}`;
    send(path, callback);
}


//https://api.zuiqiangyingyu.net/index.php/api/guess_v2/Share?wechat_type=wechat_song&token=6726f7ac90cfceefd1cf172f5c2f1deb&uid=18290043&type=rank&sid=function%20(a)%7B%220%22%3D%3Da.data.c%26%26console.log(a)%7D
//https://api.zuiqiangyingyu.net/index.php/api/guess_v2/top_friend?token=6726f7ac90cfceefd1cf172f5c2f1deb&wechat_type=wechat_song&from=151&to=200
//https://api.zuiqiangyingyu.net/index.php/api/guess_v2/Wechat_auth?wechat_type=wechat_song&code=011taFDY1bD8TZ0mbWEY1GenDY1taFDR&encryptedData=HhufNL%2BrpnYbrgQxPIGx2KBtZoNbthmnrbffJ7UGDNILLc2UHItl%2B9x0ikDe8VISprgOTR3sLx0%2B8ivvZ%2BCeL4HVkdSY1JYBvGMrPkCpWaiXFcpdZ2KrqduWLyF%2BHdZanIqumZRR6iSOY4qKou3UJ%2BnGgkLf9%2BdWMLfCAdqpOqENbxS9rdoN2TQnOTOmKNLQYtmCyUIEV%2FB1t2Yyya6OItpNqNX51RIlIT127Zy9HDl4Lgohm7KWWyEpDZ%2FW9Jx51wXNYjs1bvsk%2FkQvymQkz%2B2WFZteT4Sf6ksz4%2F0LwMqtXfJyj%2Fk0G0SlFCVXVS9CrUe580E%2Bbn8J%2Bvq%2FvbN3S15QbcRJHSBnjxXaOcjhsNs7faxupvI8YaeE4EJvNDnf6bI1kbEGWyedhgXwqJxKRp1NrMh7ldSt1Rh0iC2wCiuJpPjMYv7TnMidLUnFIikvOI%2Fjpj0ksjsTUneiS2SfdA%3D%3D&iv=O%2F9oprk4U4st6v19h5YItw%3D%3D&rawData=%7B%22nickName%22%3A%22jays%22%2C%22gender%22%3A1%2C%22language%22%3A%22zh_CN%22%2C%22city%22%3A%22Nanjing%22%2C%22province%22%3A%22Jiangsu%22%2C%22country%22%3A%22China%22%2C%22avatarUrl%22%3A%22https%3A%2F%2Fwx.qlogo.cn%2Fmmopen%2Fvi_32%2FDYAIOgq83eqp98MAhy0sVDqWS95XibibXLwYWcTnNPDdWs0ZVPCxW0lGLhJHEv4NUghR3Juh0hlqFecXmiauWiaB9A%2F0%22%7D&signature=9dde654c39dc85454a1b736e0b593f75f626f040
//https://api.zuiqiangyingyu.net/index.php/api/guess_v2/top_friend?token=480fe1994dfe184538a09f4e9060101a&wechat_type=wechat_song&from=1&to=50
// function loop(){
//     getsong(d=>{
//         var data = JSON.parse(d);
//         if(data['c'] && data['c'] != "0" && data['d']['user']['pass_next']) return ;
//         var filename = `song2/pass${data['d']['user']['pass_next']}.json`;
//         if (!fs.existsSync(filename)) {
//              fs.writeFile(filename, d, function(err) {
//                  if(err) {
//                      console.log(err);
//                  }
//              });
//         }
//         var ans = encodeURIComponent(data['d']['list'][0]['answer']);
//         var id = data['d']['list'][0]['id'];
//         answer(ans, id , d=>{
//              console.log(d);
//         });
//         loop();
//     });
// }
// loop();

function loop(){
    getsong(d=>{
        
         var data = JSON.parse(d);
         if(data['c'] && data['c'] != "0" && data['d']['list'][0]['id']) return ;
         var id = data['d']['list'][0]['id'];
         var pass = data['d']['list'][0]['pass'];
         var ans = encodeURIComponent(data['d']['list'][0]['answer']);
         console.log(`getsong:${id}:${pass}:${data['d']['list'][0]['answer']}`)
         share(id, d=>{
             help_answer(ans, id , pass, d=>{
                     console.log(`help_answer:${id}:${pass}:${ans}`)
                     answer(ans, id, d=>{
                        console.log("answer:->"+d + "\n\n");
                        loop();
                     }) 
              }); 
         });
    })
}
loop();

//https://api.zuiqiangyingyu.net/index.php/api/guess_v2/Index?token=6726f7ac90cfceefd1cf172f5c2f1deb&user_id=18290043&wechat_type=wechat_song&pass=1&uid2=21053020&sid=3024
//https://api.zuiqiangyingyu.net/index.php/api/guess_v2/Share?wechat_type=wechat_song&token=480fe1994dfe184538a09f4e9060101a&uid=21053020&type=help&sid=3024



//https://api.zuiqiangyingyu.net/index.php/api/guess_v2/Sub?answer=%E5%96%9C%E6%AC%A2%E4%BD%A0&wechat_type=wechat_song&token=f910d7aab3a3015465686f3cf93f086f&sid=496
//https://api.zuiqiangyingyu.net/index.php/api/guess_v2/Index?token=41221d93ac790046892e4dc900fe9909&wechat_type=wechat_song
/*

*/