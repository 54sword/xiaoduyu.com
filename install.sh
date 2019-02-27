#!/bin/bash

# 登陆的服务器
SERVER='root@ip'

# 项目端口号
PM2_NAME="www"

# 项目在服务器的路径地址
SERVER_DIR="/root/wwwroot/www"

echo "正在执行安装脚本..."
echo "打包项目中..."
npm run dist

echo "将要上传到服务器的文件，压缩成.zip"
zip -r ./dist.zip ./dist
zip -r ./public.zip ./public
zip -r ./node_modules.zip ./node_modules

# 本地项目需要上传的文件
LOCAL_DIR=`
  find $(pwd)/dist.zip;
  find $(pwd)/public.zip;
  find $(pwd)/node_modules.zip;
`

# 服务器运行命令
COMMAND="
  cd $SERVER_DIR && unzip ./dist.zip;
  cd $SERVER_DIR && unzip ./public.zip;
  cd $SERVER_DIR && unzip ./node_modules.zip;
  cd $SERVER_DIR && rm -rf ./dist.zip;
  cd $SERVER_DIR && rm -rf ./public.zip;
  cd $SERVER_DIR && rm -rf ./node_modules.zip;
  cd $SERVER_DIR && pm2 start ./dist/server/server.js --name '$PM2_NAME' --max-memory-restart 400M;
"

echo "创建项目文件夹"
ssh ${SERVER} "mkdir $SERVER_DIR"

echo "上传项目文件中..."
scp -r ${LOCAL_DIR} ${SERVER}:${SERVER_DIR}

echo "解压.zip文件，删除已经解压的.zip文件，pm2 启动项目中..."
ssh ${SERVER} ${COMMAND}

echo "删除本地压缩文件"
rm -rf ./dist.zip
rm -rf ./public.zip
rm -rf ./node_modules.zip

echo "完成"