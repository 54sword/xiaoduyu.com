# 小度鱼（前端）

### 介绍
小度鱼，是基于 React + GraphQL + NodeJS + Express + MongoDB 开发的一个社区系统  
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
6. npm run start  
7. 访问 http://localhost:4000  
8. 完成
```

### 开发环境  

```
npm run start
```

### 生产环境测试


```
npm run pro
```

### 部署到服务器
1、打包项目

```
npm run dist 
```
  
2、将 dist、package.json、package-lock.json 上传到服务器，然后执行如下命令，安装依赖包

```
npm install
```
3、启动服务  

```
node ./dist/server/server.js
```

### 小度鱼相关开源项目
 + 前端：[https://github.com/54sword/xiaoduyu.com](https://github.com/54sword/xiaoduyu.com)  
 + 后端：[https://github.com/54sword/api.xiaoduyu.com](https://github.com/54sword/api.xiaoduyu.com)  
 + 移动端：[https://github.com/54sword/xiaoduyuReactNative](https://github.com/54sword/xiaoduyuReactNative)  
 + 后台管理：[https://github.com/54sword/admin.xiaoduyu.com](https://github.com/54sword/admin.xiaoduyu.com)  
 + 自制React同构脚手架：[https://github.com/54sword/react-starter](https://github.com/54sword/react-starter)  

### 开源协议
MIT
