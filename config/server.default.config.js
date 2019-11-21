module.exports = {

  /**
   * 服务器相关配置
   * 用于支持shell脚本，一键安装与一键更新
   * 
   * 注意
   * 1、服务器需要安装nodejs与pm2，并可以全局调用node、pm2
   * 2、让本机支持ssh免密码登录服务器，具体配置方式：https://www.cnblogs.com/bingoli/p/10567734.html
   */
  // 服务器的ip地址
  SERVER_IP: '0.0.0.0',
  // pm2 name
  PM2_NAME: 'www',
  // 项目路径
  SERVER_DIR: '/root/wwwroot/www',

  // ==================================================
  // 将静态文件批上传到七牛的配置
  qiniu: {
    BUCKET: '',
    ACCESS_KEY: '',
    SECRET_KEY: ''
  }
}