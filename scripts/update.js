var exec = require('child_process').exec;
var config = require('../config/server.config.js');

function execute(cmd) {
  console.log('正在执行更新操作，请勿关闭（更新需花费一些时间，请耐心等待）...');
  console.log(cmd);
  exec(cmd, {maxBuffer: 1024 * 1024 * 500}, function(error, stdout, stderr) {    
    if (error) {
      console.error(error);
    } else {
      console.log(stdout);
    }
  });
}

execute(`bash ./scripts/install-and-update.sh ${config.SERVER_IP} ${config.PM2_NAME} ${config.SERVER_DIR} update`);