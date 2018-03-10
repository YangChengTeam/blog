# 关于React-Native项目开发探究

## 关于环境搭建

> [React-Native环境搭建](http://facebook.github.io/react-native/docs/getting-started.html)           
**注意** npm5 降级 npm4  (npm5会导致一个bug)    
npm 国内替换淘宝源       
也可以用yarn替换npm （yarn同样替换淘宝源） npm有点慢     


### 1.快速搭建
> 无sdk搭建 快速上手 不生成项目 依托expo       
[关于expo](https://expo.io/)     
```
npm install -g create-react-native-app  

create-react-native-app AwesomeProject

cd AwesomeProject
npm start 

```        

 

### 2.项目搭建
```
npm install -g react-native-cli
react-native init AwesomeProject

cd AwesomeProject
react-native run-ios

```


## 运行时
[runtime](https://facebook.github.io/react-native/docs/javascript-environment.html)

## 关于路由
[详见](https://github.com/aksonov/react-native-router-flux)

## 关于http网络
[详见](https://facebook.github.io/react-native/docs/network.html)

## [其它]
[其它](https://facebook.github.io/react-native/docs/)

## [遇到问题]

- Q:ios编绎错误：glog-0.3.4.tar.gz: No such file or directory   
- A:[glog](http://blog.csdn.net/chevins/article/details/78489688)



