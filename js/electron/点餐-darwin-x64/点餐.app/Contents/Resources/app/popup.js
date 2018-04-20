$(function() {
    if(!checkHour(9)){
        $(".noon_hand").prop("disabled", true);
    }

    if(!checkHour(14) &&  !(checkHour(15) && checkMinutes2(30))){
        $(".night_hand").prop("disabled", true);
    }
    
    getValueByArray(["password", "dingding_auto", "webhook", "link", "msg", "username", "bumen", "noon_auto", "night_auto", "noon_time", "night_time"],
    function(result) {
        if (result.password != undefined) {
            $(".password").val(result.password);
        }

        if (result.username != undefined) {
            $(".username").val(result.username);
        }

        if (result.bumen != undefined) {
            $(".bumen").val(result.bumen);
        }

        if (result.noon_auto != undefined) {
            if (result.noon_auto && result.noon_auto !== "false") {
                $(".noon_auto").prop("checked", "checked");
            }
        }

        if (result.night_auto != undefined) {
            if (result.night_auto && result.night_auto !== "false" ) {
                $(".night_auto").prop("checked", "checked");
            }
        }

        if (result.noon_time != undefined) {
            $(".noon_time").val(result.noon_time);
        }

        if (result.night_time != undefined) {
            $(".night_time").val(result.night_time);
        }

        if (result.webhook != undefined) {
            $(".webhook").val(result.webhook);
        }

        if (result.link != undefined) {
            $(".link").val(result.link);
        }

        if (result.msg != undefined) {
            $(".msg").val(result.msg);
        }

        if (result.dingding_auto != undefined) {
            if (result.dingding_auto && result.dingding_auto !== "false") {
                $(".dingding_auto").prop("checked", "checked");
            }
        }
    });

    $(".test").click(function(){
        scope = $(this);
        password = $(".password").val();
        username = $(".username").val();

        saveObject({
            "password": password,
            "username": username
        },

        function() {
            scope.prop("disabled", true);
            test(scope);
        });
    });

    $(".send").click(function(){
        dingding_auto = $(".dingding_auto").val();
        link = $(".link").val();
        msg = $(".msg").val();
        webhook = $(".webhook").val();

        saveObject({
            "link": link,
            "msg": msg,
            "webhook": webhook,
            "dingding_auto": dingding_auto
        },
        function() {
            message("温馨提醒", "正在发送...");
            dingding2(0, function(){
                message("温馨提醒", "发送成功");
            });
        });

    });

    $(".save2").click(function() {
      dingding_auto = $(".dingding_auto").prop("checked");
      link = $(".link").val();
      msg = $(".msg").val();
      webhook = $(".webhook").val();

      saveObject({
          "link": link,
          "msg": msg,
          "webhook": webhook,
          "dingding_auto": dingding_auto
      },
      function() {
          message("温馨提醒", "保存成功");
      });
    });

    $(".save").click(function() {
        username = $(".username").val();
        bumen = $(".bumen").val();
        noon_time = $(".noon_time").val();
        night_time = $(".night_time").val();
        noon_auto = $(".noon_auto").prop("checked");
        night_auto = $(".night_auto").prop("checked");
        password = $(".password").val();
        saveObject({
            "username": username,
            "password": password,
            "bumen": bumen,
            "noon_auto": noon_auto,
            "night_auto": night_auto,
            "noon_time": noon_time,
            "night_time": night_time
        },
        function() {
            message("温馨提醒", "保存成功");
        });
    });

    $(".noon_hand").click(function() {
        scope = $(this);
        scope.prop("disabled", true);
        $(".back").click();
        message("温馨提醒", "请稍后,正在点午餐...");
        noon2(scope);
    });

    $(".night_hand").click(function() {
        scope = $(this);
        scope.prop("disabled", true);
        $(".back").click();
        message("温馨提醒", "请稍后,正在点晚餐...");
        night2(scope);
    });

    $(".view").click(function() {
        scope = $(this);
        scope.prop("disabled", true);
        message("温馨提醒", "正在查询...");
        getValueByArray(["username"],
        function(result) {
            view(result.username,
            function() {},
            function(data) {
                scope.prop("disabled", false);
                jdata = $(data);
                trs = jdata.find(".detail_list tr");
                if(trs.size() <= 1){
                    getValueByArray("s_view", function(result2){
                        if(result2.s_view == undefined || result2.s_view == ""){
                            message("温馨提醒", "抱歉, 暂时还没有人员点餐。");
                            return;
                        }
                        jdata = $(result2.s_view);
                        trs = jdata.find(".detail_list tr");

                        if(trs.size() <= 1){
                            message("温馨提醒", "抱歉, 暂时还没有人员点餐。");
                            return;
                        }
                        showMembers(jdata, trs, data, result.username);
                    });
                } else {
                   saveObject({"s_view" : data}, function(){});
                   showMembers(jdata, trs, data, result.username);
                }
            }, scope);
        });
    });

    function showMembers(jdata, trs, data, username){
      message("温馨提醒", "查询成功");
      $(".session").hide();
      $(".session2").show();
      var isOrder = false;
      var html = "<div class='you'>❃共<strong>"+ (trs.size() - 1) +"</strong>人点餐";
      for (var i = 0; i < trs.size(); i++) {
          tr = trs.eq(i);
          if (tr.html().indexOf(username) != -1) {
              tr.addClass("redBg");
              isOrder = true;
              html += "，您是第<strong>" + i + "</strong>个。";
              break;
          }
      }
      var classStr = "";
      if(!isOrder){
        if(checkHour(9)){
            classStr = "noon_hand";
        }
        if(checkHour(14) ||  (checkHour(15) && checkMinutes2(30))){
            classStr = "night_hand";
        }
        html += "，<strong>您还没有点餐</strong>。<input type='button' value='立即点餐' class='"+classStr+"'/><br/>";
      }
      html += "</div>";
      html += jdata.find(".detail_list").html();
      $(".whos").html(html);

      if(!isOrder){
          order3(classStr);
      }
    }

    $(".robin").click(function(){
        $(".session").hide();
        $(".session3").show();
    });

    $(".back").click(function() {
        $(".session").show();
        $(".session2").hide();
        $(".session3").hide();
    });
});

function order3(classStr){
      if(classStr == 'noon_hand') {
          $(".noon_hand").click(function() {
              scope = $(this);
              scope.prop("disabled", true);
              $(".back").click();
              message("温馨提醒", "请稍后,正在点午餐...");
              noon2(scope);
          });
      }

      if(classStr == 'night_hand') {
        $(".night_hand").click(function() {
             scope = $(this);
             scope.prop("disabled", true);
             message("温馨提醒", "请稍后,正在点晚餐...");
             night2(scope);
             $(".back").click();
       });
     }
}
