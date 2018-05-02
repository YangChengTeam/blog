#!/bin/sh
# 作者: 张凯


app_name=${1}
dir=${2}


sed -i "s/游戏助手/$app_name/g" "${dir}/res/values/strings.xml"
sed -i "s/360手机助手/${app_name}/g" "${dir}/res/values/strings.xml"

cp -f "${dir}.png" "${dir}/res/mipmap-hdpi-v4/logo.png"
cp -f "styles.xml" "${dir}/res/values-v24/styles.xml"


