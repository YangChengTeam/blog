$(function() {
    getValue(["username", "bumen"],
    function(result) {
        if (result.username == "" || result.username == undefined || result.bumen == undefined || result.bumen == "0") {
            alert("请设置您的信息");
        }
    });

    setInterval(function() {
        if (!isWeekDay()) {
            console.log("weekday");
            return;
        }

        if(checkHour(9) && checkMinutes(50)){
            saveMembers();
        }

        resetSuccess();
        getValue(["night_auto", "noon_auto", "dingding_auto"],
        function(result) {
            console.log("alarms run");
            if (result.night_auto) {
                night();
            }
            if (result.noon_auto) {
                noon();
            }
            if (result.dingding_auto) {
                noon_ding();
                noon_ding2();
                night_ding();
                night_ding2();
            }
            offwork();
        });
    }, 1000*10)
});
