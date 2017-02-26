# 小度鱼（前端）

## 介绍
小度鱼，是基于 React 和 NodeJS + Express 开发的社区系统。  
线上站点：[xiaoduyu.com](https://www.xiaoduyu.com)

## 特点
+ 页面极度简洁
+ 单页面应用，前后端分离
+ 使用 React 服务器端渲染，首屏服务端渲染，且完美支持SEO
+ 功能丰富，支持富文本编辑器，头像上传与裁剪，支持邮箱、微博、QQ注册登录，等等

## 开发部署
	1. 安装 Node.js[必须]
	2. git clone git@github.com:54sword/xiaoduyu.com.git
	3. cd xiaoduyu.com
	4. npm install
	5. 在 ./node_modules/react-qiniu/index.js 第33行，增加一行如下代码
		if (typeof window == 'undefined' || typeof document == 'undefined') { return {} }
	5. cp config/index.default.js config/index.js 请根据需要修改 config/index.js 配置文件
	6. npm run dev
	7. 访问 http://localhost:4000
	8. 完成

## 发布部署
	1. 安装 Node.js[必须]
	2. git clone git@github.com:54sword/xiaoduyu.com.git
	3. cd xiaoduyu.com
	4. npm install
	5. 在 ./node_modules/react-qiniu/index.js 第33行，增加一行如下代码
		if (typeof window == 'undefined' || typeof document == 'undefined') { return {} }
	5. cp config/index.default.js config/index.js 请根据需要修改 config/index.js 配置文件
	6. npm run build
	7. npm run server
	8. 访问 http://localhost:4000
	9. 完成

## 开源协议
MIT