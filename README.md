<p align="center">
<img src="https://qncdn.xiaoduyu.com/20190507.png" alt="小度鱼" width="100">
</p>
<h1 align="center">小度鱼(网站)</h1>
<p align="center">年轻人的交流社区</p>

## 小度鱼开源项目
|项目|项目体验|原代码|主要技术栈|
|:---:|:---:|:---:|:---:|
|WEB网站|[www.xiaoduyu.com](https://www.xiaoduyu.com)|[github.com/54sword/xiaoduyu.com](https://github.com/54sword/xiaoduyu.com)|React、Redux、React-Router、GraphQL|
|APP（iOS、Android）|![小度鱼](https://qncdn.xiaoduyu.com/qrcode.png "小度鱼")|[github.com/54sword/xiaoduyuReactNative](https://github.com/54sword/xiaoduyuReactNative)|React-Native、Redux、React-Navigation、GraphQL|
|后端API|[www.xiaoduyu.com/graphql](https://www.xiaoduyu.com/graphql)|[github.com/54sword/api.xiaoduyu.com](https://github.com/54sword/api.xiaoduyu.com)|TypeScript、NodeJS、Express、MongoDB、GraphQL|
|后台管理|[admin.xiaoduyu.com](http://admin.xiaoduyu.com)|[github.com/54sword/admin.xiaoduyu.com](https://github.com/54sword/admin.xiaoduyu.com)|React、Redux、React-Router、GraphQL|

## 开发环境部署

```
1. 安装 Node.js  
2. git clone git@github.com:54sword/xiaoduyu.com.git  
3. cd xiaoduyu.com  
4. npm install  
5. cp config/index.default.js config/index.js  
6. npm run dev  
7. 访问 http://localhost:4000  
8. 完成
```

## 手动部署到服务器
1、安装 Node.js  
2、打包项目

```
npm run dist 
```
  
3、将 dist、package.json、package-lock.json 上传到服务器，然后在服务器进入到项目目录，执行如下命令，安装依赖包

```
npm install
```
4、在项目目录下创建logs文件夹  
5、启动服务  

```
node ./dist/server/server.js
```

## 脚本部署（将本地项目安装或更新到服务器）
使用shell脚本一键安装或更新  

1、服务器上安装nodejs与pm2，并需支持全局调用node、pm2命令  
 
2、配置ssh免密码登录服务器  
让本机支持ssh免密码登录服务器，配置方法：[https://www.cnblogs.com/bingoli/p/10567734.html](https://www.cnblogs.com/bingoli/p/10567734.html)   

3、创建相关的配置文件   
 
```
cp config/server.default.config.js config/server.config.js
```
填写 SERVER_IP、PM2_NAME、SERVER_DIR 配置项  

4、执行安装命令

```
npm run install-to-server
```
5、执行更新命令（本地有修改需要更新的时候执行）

```
npm run update-to-server
```

## 批上传客户端静态文件到七牛
1、创建相关的配置文件，如果已经创建跳过此步骤   

```
cp config/server.default.config.js config/server.config.js
```
填写配置文件中 qiniu 的信息   

2、配置打包静态资源路径   
修改配置文件（config/index.js）中的publicPath参数（打包的文件，dist/client/*）  

为空时候生产路径：/vendor.db2587d7b2ad7ef882f8.css   
如果填写 //img.xiaoduyu.com，生产路径：//img.xiaoduyu.com/vendor.db2587d7b2ad7ef882f8.css  
这里的//img.xiaoduyu.com，可替换成你的七牛融合 CDN 加速域名

2、执行批上传

```
npm run upload-to-qiniu
```

## 开源协议
MIT
