#!/bin/sh
# 作者: 张凯

# ab测试： ab -c 1000 -n 1000 http://192.168.80.251:8443/genapk 

apktool_path='views/pkg/script/apktool.jar'  #apktool.jar文件路径
jks_path='fyzs.jks' #签名文件路径
gen_limit=4   #根据服务器配置动态调优(默认设置为cpu个数)

apk_path=${1}   #apk文件路径
app_name=${2}   #apk文件安装后名称
icon_path=${3}  #apk文件安装后图标路径
apk_name=${4}   #apk文件名称

# 检测参数是否完整
if [[ $# != 4 ]];
then
	echo "I: 参数不正确"
	echo "usage: ./auto.sh apk_path app_name icon_path apk_name"
	exit
fi

# 检测当前app_name是否正在打包
if [[ -e "${apk_name}.dypkg" ]];
then
	echo "I: ${app_name}正在打包..."
	exit
fi

# 检测打包进程上限
result=0
for (( i=1; i<=$gen_limit; i++ ))
do
if [[ ! -e "$i.dypkg" ]];
then
   result=$i
   break
fi
done

if [[ $result == 0 ]];
then
    echo "I: 打包进程已达到上限请稍后"
	exit
fi

# 生成标识文件
echo result>${apk_name}.dypkg
echo result>${result}.dypkg

# 生成随机目录标识
dir=$RANDOM$RANDOM

#反编译
java -jar ${apktool_path} d ${apk_path} -o ${dir}

#改应用名称 图标

# 转换图片为apk文件可识别的大小和格式
convert -resize 96x96! ${icon_path} ${dir}.png

sed -i "" "s/小说助手/${app_name}/g" "${dir}/res/values/strings.xml"
cp -f "${dir}.png" "${dir}/res/mipmap-xxhdpi-v4/lanuch.png"

#回编
java -jar ${apktool_path} b ${dir} -o ${dir}.apk

#签名
jarsigner -verbose -keystore ${jks_path} -signedjar ${apk_name}.apk ${dir}.apk fyzs -storepass 123456

#清理
rm -rf ${apk_name}.dypkg
rm -rf ${result}.dypkg
rm -rf ${dir}.apk
rm -rf ${dir}.png
rm -rf ${dir}

