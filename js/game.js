const https = require('https');
const querystring = require('querystring');                                                                                                                                                                                                
var options;
function send(path, params, callback){
   options = {
  		hostname: 'h5.bshu.com',
  		port: 443,
  		path: path,
  		method: 'POST',
      headers:  {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': querystring.stringify(params).length
    }
	};

	const req = https.request(options, (res) => {
 		const code =  res.statusCode;
  		if(code != 200) return;

  		 res.on('data', (d) => {
     		  console.log(d.toString());
          if(callback){
              callback();
          }
  		});
	});

	req.on('error', (e) => {
  		console.error(e);
	});
  req.write(querystring.stringify(params));
	req.end();
}



var params = {
       user_id: 89,
       group_id: 'GjEyG5M0mRnL_LD7J8SgxISAOCPQ',
       score: 99999999999
    }
send('/game/index/gid_score',  params);


/*
{
  "code": 0,
  "data": {
    "lists": [{
      "id": "89",
      "group_id": "GjEyG5M0mRnL_LD7J8SgxISAOCPQ",
      "user_id": "89",
      "score": "2147483647",
      "gid": "11",
      "add_time": "1517905090",
      "openid": "ojEyG5KGAxY6SpqLBYiB7e1V1J94",
      "nickname": "\u9762\u9762",
      "gender": "1",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTIomVpJtTuJnj2XjVI6jM1x1kFJ53UD8oic8ia1r0plRVibc5Fbe0ZrUXd3kpFRb17SBrhczxmdvTIkw\/0",
      "country": "",
      "province": "",
      "city": "",
      "reg_time": "1517903503",
      "rank": 1
    }, {
      "id": "43",
      "group_id": "0",
      "user_id": "43",
      "score": "11036",
      "gid": "0",
      "add_time": "1517904767",
      "openid": "ojEyG5GPzV8KfUaWCvviw9PQKjas",
      "nickname": "\u524d\u6392\u5403\u74dc\u7fa4\u4f17\uff01",
      "gender": "1",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/dzDvH3H9oXxOiaGvmpXULxOC9CDrK9ibMOZpnaUubJMczUOyRR5xXCOhcgwwkHYyXibclEZDgsjsEpCLkIjYOtnKg\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5357",
      "city": "\u957f\u6c99",
      "reg_time": "1517903160",
      "rank": 2
    }, {
      "id": "54",
      "group_id": "0",
      "user_id": "54",
      "score": "5472",
      "gid": "0",
      "add_time": "1517904163",
      "openid": "ojEyG5P2yV1_fqFeNrek1ZKjsyjM",
      "nickname": "\u4e0d\u8981\u7761\u61d2\u89c9",
      "gender": "2",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTLGLDeEliafGHLqRZM50aRy4ysdQxWfwlDjYESwg2ysvE8r268eC3FjqMwzOicEvDqA6fRr8oQPC2TA\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5317",
      "city": "\u6b66\u6c49",
      "reg_time": "1517903214",
      "rank": 3
    }, {
      "id": "72",
      "group_id": "0",
      "user_id": "72",
      "score": "5244",
      "gid": "0",
      "add_time": "1517904823",
      "openid": "ojEyG5KV3KeK-GM39AaccX1D2Uf0",
      "nickname": "\u6c5f\u57ce\u6e38\u5b50",
      "gender": "1",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/CSb161Q1TWPuG1Du1o5dDNNegiaGInp5X9GsnDAQGRdCtiaAQtArYwB9e0VmfPl6TuhtkRyc7lPL4sNBMrzYkxmA\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5317",
      "city": "\u6b66\u6c49",
      "reg_time": "1517903339",
      "rank": 4
    }, {
      "id": "60",
      "group_id": "0",
      "user_id": "60",
      "score": "5120",
      "gid": "0",
      "add_time": "1517903984",
      "openid": "ojEyG5NYg2ooxwgbtB7gvW51UnR0",
      "nickname": "\u65e0\u540d\u5c0f\u5352",
      "gender": "1",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTKaB4qaggYaN8rCTZjWvWmjwfjYWORaQuJlZvNUXQcmlHgDyJQ5RUGfJ39f2GWNkDTA5ISebmeetQ\/0",
      "country": "\u745e\u58eb",
      "province": "\u6c83",
      "city": "",
      "reg_time": "1517903249",
      "rank": 5
    }, {
      "id": "7",
      "group_id": "GjEyG5EHfJS9MZKhnkqusqjNWAt0",
      "user_id": "7",
      "score": "3208",
      "gid": "7",
      "add_time": "1517050817",
      "openid": "ojEyG5AIkqTdsdtVspFBDmXxxHfY",
      "nickname": "\u738b\u6770",
      "gender": "1",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/FvdibjUVYMOCD4AbibzQVLdicJj7Ks82x9e7Eck32WFJHJibBlX8xoNxSDHrQxSbgXibSSdjGrDpWpDo8jNSKRZBq5g\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5317",
      "city": "\u9102\u5dde",
      "reg_time": "1517029662",
      "rank": 6
    }, {
      "id": "44",
      "group_id": "0",
      "user_id": "44",
      "score": "3148",
      "gid": "0",
      "add_time": "1517905149",
      "openid": "ojEyG5Dev2AVZKzJ-T8yR2jACdAM",
      "nickname": "sunshey",
      "gender": "1",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/DYAIOgq83eqAJicBqziawRwQ1EdjokP5iae8HMOFFc1Avd7eqWMicgpicibWUwIVVu5PFY9rsO45bDgAEGuq9JxIhOibA\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5317",
      "city": "\u5341\u5830",
      "reg_time": "1517903162",
      "rank": 7
    }, {
      "id": "41",
      "group_id": "0",
      "user_id": "41",
      "score": "2480",
      "gid": "0",
      "add_time": "1517905118",
      "openid": "ojEyG5M1CBEfYz3AkKT9xeqwBmt0",
      "nickname": "~ \u2600\ufe0f \u5218\u6653\u8513 \u5f0f\u751f\u6d3b \u3002",
      "gender": "2",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/f1XicWbZLOghx1DsnIgW2dupIz2GmDbDKeKKpCrTZrWGFwonOehPezGs6zpJj8CJE07gfMxXEq2JchSoqf3ZEtQ\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5317",
      "city": "\u6b66\u6c49",
      "reg_time": "1517903144",
      "rank": 8
    }, {
      "id": "56",
      "group_id": "0",
      "user_id": "56",
      "score": "1292",
      "gid": "0",
      "add_time": "1517904137",
      "openid": "ojEyG5BDuPeo6T_ue0AGwOchmx2Q",
      "nickname": "",
      "gender": "2",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTITMOgGFEF0G8Ff7pBaPpnrPJs0nxVxbAF7mc3NcHaeDLhvU1Ky9AQA3wn5t3AtPfpVAPCpYqlDibw\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5317",
      "city": "\u6b66\u6c49",
      "reg_time": "1517903221",
      "rank": 9
    }, {
      "id": "6",
      "group_id": "0",
      "user_id": "6",
      "score": "1232",
      "gid": "0",
      "add_time": "1517902520",
      "openid": "ojEyG5IT1trDoWRvnE1VUwnx4koY",
      "nickname": "\u4f60\u662f\u8c01\uff1f\u4f60\u53c8\u662f\u8c01\uff1f",
      "gender": "1",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJbMKaJpOa6ObnibOktNJIdUVm2lWwgcR9sks2FXjHvf64FLDt9lbFfNkaT15T4Jj73yKXbpibDh2Yg\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5317",
      "city": "\u6b66\u6c49",
      "reg_time": "1517028568",
      "rank": 10
    }, {
      "id": "5",
      "group_id": "GjEyG5GXGVh1F5dKxpP1QVv5bg1c",
      "user_id": "5",
      "score": "1176",
      "gid": "9",
      "add_time": "1517193458",
      "openid": "ojEyG5NvI_fHiuUOX6uDV-q0G7UA",
      "nickname": "\u9ec4\u5929\u5b87",
      "gender": "1",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/ibfk3icA5WDkbALoFCYb36rIhXCrW8sCeruwYDB75hib3WVrhayq1EWUfV4HvWYyEYoBBapmWFF8w63A8j9wwSHLg\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5317",
      "city": "\u6b66\u6c49",
      "reg_time": "1517026648",
      "rank": 11
    }, {
      "id": "42",
      "group_id": "0",
      "user_id": "42",
      "score": "0",
      "gid": "0",
      "add_time": "1517904495",
      "openid": "ojEyG5PmGpMvLO3Bty7vWY1Gm-hc",
      "nickname": "L",
      "gender": "1",
      "language": "zh_CN",
      "avatarurl": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/brqYCiafjNSHzZuBrCnTjUGJK6nBTZJibEb8q6bYRs27EYPFmkSD7e9WUbtVVOicUiaqZEdTpycyYfTp1fWibqqxRgg\/0",
      "country": "\u4e2d\u56fd",
      "province": "\u6e56\u5317",
      "city": "\u6b66\u6c49",
      "reg_time": "1517903156",
      "rank": 12
    }],
    "rank": 1
  },
  "msg": ""
}
*/