const mainConfig = require('./index');

let config = {

  // 公共debug开关
  debug: false,

  // 启动日志，日志生成在logs文件夹
  logs: true,
  
  // 是否显示API请求信息与结果在控制台(线上环境建议关闭)
  apiLog: false,

  // 是否显示redux的日志在控制台(线上环境建议关闭)
  reduxLog: false,
  
  // token在cookie中的有效时间
  tokenMaxAge: 1000 * 60 * 60 * 24 * 30,

  /*
   * 设置缓存有效时间（毫秒单位），0为不缓存
   * 缓存机制：游客所有的请求、会员更新频率低的请求
   */
  cache: 1000 * 60 * 3,

  // [服务端]每秒打印一次内存占用情况，显示在控制台，用于排查内存泄漏的问题
  memoryUsage: false,
  
  posts: {
    // 帖子在列表时候，内容最大显示高度，0为不限制
    contentMaxHeight: 500
  },
  
  comment: {
    // 评论在列表时候，内容最大显示高度，0为不限制
    contentMaxHeight: 300
  },
  
  // 启动作者广告功能
  authorAD: false

}

if (mainConfig.debug) {
  config.debug = true;
  config.logs = false;
  config.apiLog = true;
  config.reduxLog = true;
  // config.memoryUsage = true;
}

module.exports = config;