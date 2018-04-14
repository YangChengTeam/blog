"auto"
console.show()

var apkfile ="/storage/emulated/0/$MuMu共享文件夹/VStudy.apk"
files.copy(apkfile, "/sdcard/VStudy.apk")
log("卸载中...")
shell("adb uninstall com.v.study", true)
log("卸载成功")
log("安装中...")
shell("adb install /sdcard/VStudy.apk", true)
log("安装成功")
var accountfile ="/storage/emulated/0/$MuMu共享文件夹/account.txt" 
app.launch("com.v.study")
log("登录中...")
login()
log("登录完成...")

function login(){
	id("account_login_ll").waitFor()
	id("account_login_ll").click()
	var account = files.read(accountfile).split("\n")
	if(account.length > 1){
		id("edit_account").waitFor()
		id("edit_account").click()
		for(var i = 0; i <=  account[0].length; i++){
			shell("adb shell input keyevent 67", true)
		}
		shell("adb shell input text "+ account[0], true)
		id("edit_password").focus()
		for(var i = 0; i <=  account[1].length; i++){
			shell("adb shell input keyevent 67", true)
		}
		shell("adb shell input text " + account[1], true)
		id("btn_login").click()
		id("btn_choice").waitFor()
		id("btn_choice").click()
	}
}
