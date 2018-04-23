function login(username, password, callback) {
    $.ajax({
        type: 'GET',
        url: "/login",
        data: {
            "username": username,
            "password": password,
            "hostname": 'dc.wk2.com'
        },
        success: function(data, status, xhr) {
            var jerror = $(data).find(".error");
            if (jerror.size() > 0) {
                callback(false);
                return;
            }
            callback(true);
        },
        cache: false
    });
}

function test(scope) {
    getValueByArray(["password", "username"],
    function(result) {
        if (result.password && result.username) {
            login(result.username, result.password,
            function(islogin) {
                scope.prop("disabled", false);
                if (islogin) {
                    message("温馨提醒", "连接成功");
                } else {
                    message("温馨提醒", "连接失败");
                }
            });
        } else {
            scope.prop("disabled", false);
            message("温馨提醒", "请先设置帐号密码");
        }
    });
}

function view(username, successfn, showfn, scope) {
    getValueByArray(["password", "username"],
    function(result) {
        if (result.password && result.username) {
            login(result.username, result.password,
            function(islogin) {
                if (!islogin) {
                    message("温馨提醒", "登录失败, 请检查用户名密码是否设置正确");
                    if(scope){
                      scope.prop("disabled", false);
                    }
                    return;
                }
                $.ajax({
                    type: 'GET',
                    url: "/view",
                    data: {
                         "hostname": 'dc.wk2.com'
                    },
                    success: function(data, status, xhr) {
                        if (data.indexOf(username) != -1) {
                            if (successfn) {
                                successfn(data);
                            }
                        }
                        if (showfn) {
                            showfn(data);
                        }
                    },
                    cache: false
                });
            });
        } else {
            message("温馨提醒", "请先设置帐号密码");
            if(scope){
              scope.prop("disabled", false);
            }
        }
    });
}

function order(username, bumen, o_type, islogin, successfn, failfn, scope) {
    if(bumen == undefined || parseInt(bumen) == 0){
        message("温馨提醒", "请先设置部门信息");
        if(scope){
          scope.prop("disabled", false);
        }
        return;
    }
    $.ajax({
        type: 'GET',
        url: "/order",
        data: {
            'name': username,
            'bumen': bumen,
            'o_type': o_type,
            "hostname": 'dc.wk2.com'
        },
        crossDomain: true,
        success: function(data, status, xhr) {
            var jerror = $(data).find(".error");
            if (jerror.size() > 0) {
                if (failfn) {
                    failfn(data);
                }
                return;
            }
            view(username,
            function(data) {
                saveObject({
                    "success": o_type
                },
                function() {
                    if (successfn) {
                        successfn(username, o_type);
                    }
                });
            });
        },
        cache: false
    });
}

function order2(o_type, successfn, failfn, scope) {
    getValueByArray(["password", "username", "bumen"],
    function(result) {
        if (result.password && result.username) {
            login(result.username, result.password,
            function(islogin) {
                if (!islogin) {
                    message("温馨提醒", "登录失败, 请检查用户名密码是否设置正确");
                    return;
                }
                order(result.username, result.bumen, o_type, islogin, successfn, failfn, scope);
            });
        } else {
            message("温馨提醒", "请先设置帐号密码");
            if(scope){
              scope.prop("disabled", false);
            }
        }
    });
}

function isWeekDay() {
    var date = new Date();
    var day = date.getDay();
    if (day == 6 || day == 0) {
        return false;
    }
    return true;
}

function checkHour(hour) {
    var date = new Date();
    var h = date.getHours();

    if (parseInt(hour) == parseInt(h)) {
        return true;
    }

    return false;
}

function checkMinutes(minutes) {
    var date = new Date();
    var m = date.getMinutes();

    if (parseInt(m) >= parseInt(minutes)) {
        return true;
    }

    return false;
}

function checkMinutes2(minutes) {
    var date = new Date();
    var m = date.getMinutes();

    if (parseInt(m) <= parseInt(minutes)) {
        return true;
    }

    return false;
}

function noon() {
    console.log("auto noon run");
    if (checkHour(9)) {
        getValue(["success", "noon_time"],
        function(result) {
            var date = new Date();
            var minutes = date.getMinutes();
            if (minutes >= parseInt(result.noon_time) && result.success != 1) {
                order2(1,
                function(username, o_type) {
                    notification("noon", "温馨提醒", username + "：已为您点好午餐.");
                });
            }
        });
    }
}

function noon2(scope) {
    if (checkHour(9)) {
        order2(1,
        function(username, o_type) {
            message("温馨提醒", username + "：已为您点好午餐.");
            scope.prop("disabled", false);
        },
        function(data) {
            var msg = $(data).find(".error").html();
            message("温馨提醒",  msg);
            scope.prop("disabled", false);
        }, scope);
        return;
    }
    scope.prop("disabled", false);
    message("温馨提醒", "抱歉,不在点餐时间");
}

function night2(scope) {
    if (checkHour(14) || (checkHour(15) && checkMinutes2(30))) {
        order2(2,
        function(username, o_type) {
            message("温馨提醒", username + "：已为您点好晚餐.");
            scope.prop("disabled", false);
        },
        function(data) {
            var msg = $(data).find(".error").html();
            message("温馨提醒", msg);
            scope.prop("disabled", false);
        }, scope);
        return;
    }
    message("温馨提醒", "抱歉,不在点餐时间");
    scope.prop("disabled", false);
}

function night() {
    console.log("auto night run");
    if (checkHour(14) || (checkHour(15) && checkMinutes2(30))) {
        getValue(["success", "night_time"],
        function(result) {
            var date = new Date();
            var minutes = date.getMinutes();
            var hour = date.getHours();
            if (minutes >= parseInt(result.night_time) && result.success != 2) {
                order2(2,
                function(username, o_type) {
                    notification("night", "点餐提示", username + "：已为您点好晚餐.");
                });
            }
        });
    }
}

function offwork() {
    if (checkHour(19)) {
        var date = new Date();
        var d = date.getDay();
        getValue("offwork",
        function(result) {
            if (result.offwork != d) {
                notification("offwork", "用餐提示", "晚餐时间到请注意用餐！");
                saveObject({
                    "offwork": d
                },
                function() {});
            }
        });
    }
    console.log("offwork run");
}

function dingding2(type, callback) {
    getValueByArray(["dingding_auto", "webhook", "link", "msg"],
    function(result) {
        msg = "{ \"msgtype\": \"text\", \"text\": {\"content\": \"" + result.msg + "\n" + result.link + "\"}, \"at\": {\"isAtAll\": true}}";
        $.ajax({
            type: 'POST',
            url: result.webhook,
            crossDomain: true,
            data: msg,
            success: function(data, status, xhr) {
                if (data.errcode == 0) {
                    if (callback) {
                        callback(type);
                        message("温馨提醒", "发送成功");
                    }
                }
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            cache: false
        });
    });
}

function dingding(type) {
    dingding2(type,
    function(type) {
        saveObject({
            "dingding_success": type
        },
        function() {});
    });
}

function noon_ding() {
    if (checkHour('09') || checkHour('9')) {
        getValue("dingding_success",
        function(result) {
            if (result.dingding_success == undefined || result.dingding_success <= 1) {
                dingding(1);
            }
        });
    }
    console.log("auto noon_ding run");
}

function noon_ding2() {
    if (checkHour(9) && checkMinutes(30)) {
        getValue("dingding_success",
        function(result) {
            if (result.dingding_success == undefined || result.dingding_success != 2) {
                dingding(2);
            }
        });
    }
    console.log("auto noon_ding2 run");
}

function night_ding() {
    if (checkHour(14) && checkMinutes(30)) {
        getValue("dingding_success",
        function(result) {
            if (result.dingding_success == undefined || result.dingding_success != 3) {
                dingding(3);
            }
        });
    }
    console.log("auto night_ding run");
}

function night_ding2() {
    if (checkHour(15)) {
        getValue("dingding_success",
        function(result) {
            if (result.dingding_success == undefined || result.dingding_success != 4) {
                dingding(4);
            }
        });
    }
    console.log("auto night_ding2 run");
}

function resetSuccess() {
    var date = new Date();
    var h = date.getHours();

    if (parseInt(h) < 9 || parseInt(h) > 16) {
        saveObject({"s_view" : ""}, function(){

        });

        getValue("dingding_success",
        function(result) {
            if (result.dingding_success == undefined || result.dingding_success != 0) {
                saveObject({
                    "dingding_success": 0
                });
            }
        });

        getValue("success",
        function(result) {
            if (result.success == undefined || result.success != 0) {
                saveObject({
                    "success": 0
                });
            }
        });
    }
    console.log("auto reset success run");
}

function saveObject(obj, callback) {
    for(let prop in obj){
        localStorage.setItem(prop, obj[prop])
    }
    if(callback){
        callback()
    }
}

function getValue(key, callback) {
    var item = localStorage.getItem(key)
    if(callback && item){
        callback(item)
    }
}

function getValueByArray(array, callback) {
    var result = {}
    for(var i=0;i<array.length;i++){
         key = array[i]
         result[key] = localStorage.getItem(key)
    }
    
    if(callback){
        callback(result)
    }
}

function notification(id, title, message) {
}

function clear() {
    var ticker = setTimeout(function() {
        $(".message").html("<div class=\"dc_notice\">" + "1、点餐时间，中餐 9:00-10:00， 晚餐14：00-15:30<br>" + "2、周六周日暂时不提供午晚餐<br>" + "3、取消点餐，请联系人事部<br>" + "4、好米、好油、好菜、好厨艺；乐厨让你吃饭无忧<br>5、勾选自动点餐后，将在星期一至星期五为您准时点餐。<br></div>");
        $(".message2").html("<div class=\"dc_notice\">1、自动提醒时间为每天9点一次 9点半一次  下午2点半一次 3点一次<br>2、提醒时间可能有点偏差、不影响实际效果<br/></div>");
        clearTimeout(ticker);
    },
    8000);
}

function saveMembers(){
  view('',
  function() {},
  function(data) {
      jdata = $(data);
      trs = jdata.find(".detail_list tr");
      if(trs.size() > 1){
          saveObject({"s_view" : data}, function(){});
      }
  });
}

function message(title, msg) {
    $(".message").html(msg);
    $(".message2").html(msg);
    clear();
    var d = new Date();
}
