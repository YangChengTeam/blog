#!/bin/sh
# 作者: 张凯


# apk_type 0 新趣小视频   1 游戏盒子

apk_path="newqu.apk"  
apktool_path="apktool.jar" 
gen_limit=4   #根据服务器配置动态调优(默认设置为cpu个数)


# 签名信息
jks_path='newqu.keystore'  
jks_ali="newqu"
jks_pass="123456"

gen_apk_path=${1} #apk生成后的路径
app_name=${2}   #apk文件安装后名称
icon_path=${3}  #apk文件安装后图标路径
apk_name=${4}   #apk文件名称
apk_type=${5}   #哪个apk

# 检测参数是否完整
if [[ $# != 5 ]];
then
	echo "I: 参数不正确"
	echo "usage: ./auto.sh app_name icon_path apk_name apk_type"
	exit 0
fi

if [[ $apk_type == 1 ]]; then
	apk_path="box.apk" 
	jks_path='xxrjy.jks'
	jks_ali="xxrjy"
	jks_pass="123456"
fi

# 检测当前app_name是否正在打包
if [[ -e "${apk_name}.dypkg" ]];
then
	echo "I: ${app_name}正在打包..."
	exit 0
fi

if [[ ! -e "${icon_path}" ]];
then
    echo "I: 图标不存在"
	exit 0
fi

# 检测打包进程是否到达上限
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
	exit  0
fi

# 生成标识文件
echo result>${apk_name}.dypkg
echo result>${result}.dypkg

# 生成随机目录标识
dir=$RANDOM$RANDOM

#反编译
java -jar ${apktool_path} d ${apk_path} -f -o ${dir}

#改应用名称 图标

# 转换图片为apk文件可识别的大小和格式
convert -resize 144x144! ${icon_path} ${dir}.png
if [[ $apk_type == 0 ]];
then
	sh newqu.sh ${app_name} ${dir}
elif [[ $apk_type == 1 ]]; then
	sh box.sh ${app_name} ${dir}
fi

#回编
java -jar ${apktool_path} b ${dir} -o ${dir}.apk

#签名
jarsigner -verbose -keystore ${jks_path} -signedjar ${apk_name}.apk ${dir}.apk ${jks_ali} -storepass ${jks_pass}

#复制到目录
cp -f ${apk_name}.apk ${gen_apk_path}

#清理
rm -rf ${apk_name}.apk
rm -rf ${apk_name}.dypkg
rm -rf ${result}.dypkg
rm -rf ${dir}.apk
rm -rf ${dir}.png
rm -rf ${dir}

