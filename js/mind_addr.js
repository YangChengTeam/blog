senddata: function() {
            var t = this.data.region.join("、") + this.data.address,
            a = this.data.prizename || "",
            n = this;
            n.data.linkman ? n.data.linkphone ? n.data.region.join() == ["省", "市", "区"].join() ? n.alert("请选择收货地址") : n.data.address ? (n.setData({
                send: !1
            }), wx.request({
                url: e.apiurl + "/api/Activity/addPrizeLog.html",
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                data: {
                    phpsessid: e.getglobal("phpsessid"),
                    linkman: n.data.linkman,
                    linkphone: n.data.linkphone,
                    prize: a,
                    address: t,
                    aid: n.data.aid
                },
                success: function(t) {
                    200 == t.data.Status ? wx.showModal({
                        title: "温馨提示",
                        content: "大侠 您的战利品即将发货,请您耐心等待，注意查收！",
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.reLaunch({
                                url: "/pages/index/index"
                            })
                        }
                    }) : 403 == t.data.Status ? wx.showModal({
                        title: "温馨提示",
                        content: t.data.Result.Message,
                        showCancel: !1,
                        confirmText: "重新登录",
                        success: function(t) {
                            t.confirm && e.login(function() {
                                n.senddata()
                            })
                        }
                    }) : n.alert(t.data.Result.Message)
                }
            })) : n.alert("请填写详细地址") : n.alert("请填写手机号码") : n.alert("请填写收货人姓名")
        }