#!/bin/sh

app_name=${1}
dir=${2}


sed -i "s/新趣小视频/${app_name}/g" "${dir}/res/values/strings.xml"
cp -f "${dir}.png" "${dir}/res/drawable-hdpi/ic_launcher.png"
cp -f "${dir}.png" "${dir}/res/drawable-xhdpi/ic_launcher.png"
cp -f "${dir}.png" "${dir}/res/drawable-xxhdpi/ic_launcher.png"
cp -f "${dir}.png" "${dir}/res/drawable-xxxhdpi/ic_launcher.png"
cp -f "abc_screen_toolbar.xml" "${dir}/res/layout-v26/abc_screen_toolbar.xml"
cp -f "styles.xml" "${dir}/res/values-v24/styles.xml"