# 小度鱼（前端篇）

## 介绍
小度鱼，是基于 React + NodeJS + Express + MongoDB 开发的一个社区系统  
线上站点：[https://www.xiaoduyu.com](https://www.xiaoduyu.com)  
iOS：[https://itunes.apple.com/cn/app/小度鱼/id1261181004?mt=8](https://itunes.apple.com/cn/app/小度鱼/id1261181004?mt=8)  
前端源码地址：[https://github.com/54sword/xiaoduyu.com](https://github.com/54sword/xiaoduyu.com)  
后端API源码地址：[https://github.com/54sword/api.xiaoduyu.com](https://github.com/54sword/api.xiaoduyu.com)  
二维码：  
![小度鱼](https://qncdn.xiaoduyu.com/1484410571.png "小度鱼")

## 特点
+ 页面极度简洁
+ 单页面应用，前后端分离
+ 使用 React 服务器端渲染，首屏服务端渲染，且完美支持SEO
+ 功能丰富，支持富文本编辑器，头像上传与裁剪，支持邮箱、微博、QQ注册登录，等等
+ 包含组件测试 (jest + enzyme)

## 安装部署
不保证 Windows 系统的兼容性

	1. 安装 Node.js 大于6的版本 [必须]
	2. git clone git@github.com:54sword/xiaoduyu.com.git
	3. cd xiaoduyu.com
	4. npm install
	5. 在 ./node_modules/react-qiniu/index.js 第33行，增加一行如下代码
		if (typeof window == 'undefined' || typeof document == 'undefined') { return {} }
	6. cp config/index.default.js config/index.js 请根据需要修改 config/index.js 配置文件
	7. npm run build
	8. NODE_ENV=production __NODE__=true node server
	9. 访问 http://localhost:4000
	10. 完成

## 开源协议
MIT
