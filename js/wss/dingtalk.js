var WebSocket=require('ws');

const ws = new WebSocket('wss://webalfa-cm3.dingtalk.com/long', {
    "Cookie": "dd_l=zh_CN; cna=EpptDhTVEGkCAdOhphz45P9o; UM_distinctid=1607d3e59d319c-01c34f96e5e0b3-163c6657-1fa400-1607d3e59d463e; isg=BP__gvC4meFEnZ0WOgmqeKTUjtVJTAN9U5cZpJHMvq74oB8imbTj1n1R5nBe-Cv-; deviceid=735F7F5D-56DB-4BC7-BE1D-0CF6E5BF5C63; deviceid_exist=true; dd_sid=0b8c69045ad7ea9f45591ed87a47e6304478b7f4ae4d; dt_s=u-42582e8-62db6c850a-bb06f49-1a96dd-3e8998f1-219e92d2-4fc9-40e9-9121-fe6a9347b32a; up_ab=y; preview_ab=y",
    "Origin": "https://im.dingtalk.com",
    "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
    "Pragma": "no-cache",
    "Sec-WebSocket-Key": "olMk1+SbruR0tzA6h4OK0A==",
    "Sec-WebSocket-Version": "13",
    "Upgrade": "websocket",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
});

ws.on('open', function open() {
  console.log('connected');
  ws.send('{"lwp":"/r/Adaptor/LogI/log","headers":{"mid":"c4d0007f 0"},"body":[{"code":2,"uid":69567208,"app":"dd","appVer":"3.6.3","os":"MAC","osVer":"10.13.4","manufacturer":"","model":"","level":1,"message":"gmkey:chat_msg_single_page_send,gokey:type=maipage_msg_list"}]}')
  ws.send('{"lwp":"/r/IDLSend/send","headers":{"mid":"c3680080 0"},"body":[{"uuid":"1524101169105303","conversationId":"4248001:69567208","type":1,"creatorType":1,"content":{"contentType":1,"textContent":{"text":"dd"},"atOpenIds":{}},"nickName":"张凯"}]}')
});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function incoming(data) {
  console.log(`Roundtrip time:  ${data} ms`);
});