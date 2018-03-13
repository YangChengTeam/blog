const https = require('https')
const fs = require('fs')
const sleep = require('sleep')
const querystring = require('querystring')                                                                                                                                                                                             


const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjo1MTQxMywiZXhwaXJlIjoxNTE4Njg2OTU2fQ.IfX8H9nz27kUnr9ET00G_W0S38-H5YNHeF4LubEe0bnt-0nPnGxMflF0qd7tWKPdA_Zh54i6hhW6BglA7UIyxUIufoWNg22Q_twcERWZva08D0zGAj-dgxOgCJUqFu1W1L_EuQEPRl4w77Ni2VYtFxZa4EL1rIntTKxZmqNlLFda56AMYrOIZXqQEajgN5VmSQ2M12NTer9hdukF9mXSabzFYeeG_ZUvYsmdT_MwZ7Wuv6cWZwvnKQAInS48yKsAC9O_-DT92BO97Rrj8rc4Iaj8eHYuVO-rEG74OpZAx0m22zG23uWbeRbGFSMEbrSUrc6e1dY3d5BsfdtY-oi_0Q"


function send(path, callback, action, params){
  var gdata = [];
  const options = {
      hostname: 'tzzl.007168.net',
      port: 443,
      path: path,
      method: action ? action : "GET",
      headers: {
         "Content-Type": "application/x-www-form-urlencoded",
         token: token,
         Referer  : "https://servicewechat.com/wxcfcc5dbb2912e30b/1/page-frame.html"

      }
  };
  if(action == 'POST'){
     options.headers['Content-Length']=querystring.stringify(params).length
  }
  const req = https.request(options, (res) => {
      const code =  res.statusCode
      if(code != 200) return

      res.on('data', (d) => {
            gdata.push(d)
      });   

      res.on('end', d => {
          if(callback){
               callback(gdata.join('').toString())
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


// 分享群获取机会
// function updateGroup(){
//    var o = {
//       code :  "021H1oQK1lMMo60tusOK1AH5QK1H1oQ",
//       iv : "l4HHjDhiJfc0ZRCV4wcgTw==",
//       en_data : "4vn+dymvYN3wpEk6gTGS29zESRD16y6/H9eR3I7GCE/1ly0O3qkaTIUycYkHKSpTdsOyABNx9XQ7yZRn6He4ZcK8IDpLbvGlQWG6nrrF7PQI1gasVtNCYQ4Tp1ojAxKTLKzqCe3nvXA4MKo8P7bDn/A=="
//   }
//   send("/api/user/updateGroup", d => {
//     console.log(d)
//   }, "POST", o)
// }


function gameStart(callback){
   let path = `/api/game/gameStart`
   send(path, callback)
}

function getQuestion(callback){
    let path = `/api/game/getQuestion?`
    send(path, callback)
}


function jumpAnswer(answer, callback){
    console.log("jumpAnswer:"+answer)
    en_answer = encodeURIComponent(answer)
    let path = `/api/game/judgeAnswer?answer=${en_answer}`
    send(path, callback)
}

function loopJumpAnswer(answers){
    var v = answers[i]
    jumpAnswer(v, d=>{ 
        var data = JSON.parse(d)
        if(isRight(data)) { 
            console.log("jumpAnswer:"+d)
            i = 0
            loop()
            return
        }
        i++
        if(i >= answers.length){
           i = 0
        }
        loopJumpAnswer(answers)     
    })
}

function isRight(data){
    if(data['errmsg'] && data['errmsg'] == "\u56de\u7b54\u6b63\u786e") { 
        return true
    }
    return false  
}

var i = 0
function loop(){
    var game = new Promise((resolve, reject)=>{
        getQuestion(d=>{
           console.log("getQuestion:"+d)
           var data = JSON.parse(d)
           if(data['errcode'] && data['errcode'] != "0") {
               reject(data['errcode'])
           } else {
               resolve(data["data"]["question"]["answer"])
           }
        })
    });
    game.then(answers=>{
        i = 0
        loopJumpAnswer(answers, loop)
    }).catch(()=>{})
}


//模拟进入
gameStart(d=>{
    console.log(d)
    sleep.sleep(3)
    loop()
})

