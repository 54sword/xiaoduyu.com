module.exports = {

  // 公共debug开关
  debug: false,

  // 是否显示API请求信息与结果(线上环境建议关闭)
  apiLog: false,

  // 是否显示redux的日志(线上环境建议关闭)
  reduxLog: false,

  // token在cookie中的有效时间
  tokenMaxAge: 1000 * 60 * 60 * 24 * 30,

  /*
   * 设置缓存有效时间（毫秒单位），0为不缓存
   * 缓存机制：游客所有的请求、会员更新频率低的请求
   */
  cache: 1000 * 60 * 5,
  
  posts: {
    // 帖子在列表时候，内容最大显示高度，0为不限制
    contentMaxHeight: 500
  },
  
  comment: {
    // 评论在列表时候，内容最大显示高度，0为不限制
    contentMaxHeight: 300
  },

  // 社交账号登陆
  social: {
    weibo: true,
    qq: true,
    github: true,
    wechat: false
  }

}