# 小度鱼（前端篇）

### 介绍
小度鱼，是基于 React + NodeJS + Express + MongoDB 开发的一个社区系统  
线上站点：[https://www.xiaoduyu.com](https://www.xiaoduyu.com)  
![小度鱼](https://qncdn.xiaoduyu.com/1484410571.png "小度鱼")

### 特点
+ 页面极度简洁
+ 单页面应用，前后端分离
+ 使用 React 服务器端渲染，首屏服务端渲染，且完美支持SEO
+ 按页面将代码分片，然后按需加载
+ 功能丰富，支持富文本编辑器，头像上传与裁剪，支持邮箱、微博、QQ注册登录，等等

### 本地部署
不保证 Windows 系统的兼容性

```
1. 安装 Node.js 大于8的版本 [必须]  
2. git clone git@github.com:54sword/xiaoduyu.com.git  
3. cd xiaoduyu.com  
4. npm install  
5. cp config/index.default.js config/index.js  
6. npm run dev  
7. 访问 http://localhost:4000  
8. 完成
```

### 开发环境  

***注意：开发环境下，代码不分片，生产环境下才会分片***

```
npm run dev
```

### 生产环境测试


```
npm run dist
npm run server
```

### 部署到服务器
1、修改 config/index.js 中的 public_path、public_path 配置  
2、打包项目

```
npm run dist 
```
  
3、将项目代码上传至你的服务器（除了node_modules，其他都上传）  
4、服务上进入项目目录，执行如下命令，安装依赖包

```
npm install
```
5、启动服务  

```
NODE_ENV=production __NODE__=true BABEL_ENV=server node src/server
```

### 其他相关开源项目
 + 前端源码地址：[https://github.com/54sword/xiaoduyu.com](https://github.com/54sword/xiaoduyu.com)  
 + 后端API源码地址：[https://github.com/54sword/api.xiaoduyu.com](https://github.com/54sword/api.xiaoduyu.com)  
 + iOS、Android（ReactNative）源码地址：[https://github.com/54sword/xiaoduyuReactNative](https://github.com/54sword/xiaoduyuReactNative)  
 + 自制前端脚手架：[https://github.com/54sword/react-starter](https://github.com/54sword/react-starter)  

### 开源协议
MIT
