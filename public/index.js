
// 开发环境配置
var development = {
  debug: true,
  // 网站名称
  name: '小度鱼',
  // 网站描述
  description: '一个网络社区',
  // 验证登录状态的cookie 名称
  auth_cookie_name: 'xiaoduyu',
  // ip
  host: '192.168.1.111',
  // 端口
  port: 4000,
  // 网站地址
  url: 'http://192.168.1.111:4000',
  // API 地址
  api_url: 'http://192.168.1.111:3000',
  // api_url: 'https://api.xiaoduyu.com',
  // api 版本路径  http://192.168.0.105:3000/api/v1
  api_verstion: 'api/v1',
  // 打包文件内用到的URL路径, 比如背景图等(可以设成http的地址, 比如: http://cdn.my.com)
  public_path: 'http://192.168.1.111:4000',
  // css modules 作用域名称
  classScopedName: '[name]_[local]__[hash:base64:5]',
  // google 分析
  GA: 'UA-87680851-1',
  // 前端静态资源上传到七牛
  qiniu: {
    accessKey: 'V7Tt-TvFyxpd0r6w0iyg6L4PkZOv0oRUsB1xymfm',
    secretKey: 'CIK0hDp3gPBBxaEA_gHyWiqVgmDldoG4a_yDg4iE',
    bucket: 'qn-cdn',
    url: '//qncdn.xiaoduyu.com'
  }
}

// 开发环境配置
var production = {
  debug: false,
  name: '小度鱼',
  description: '一个网络社区',
  auth_cookie_name: 'xiaoduyu',
  url: 'https://www.xiaoduyu.com',
  port: 84,
  api_url: 'https://www.xiaoduyu.com',
  api_verstion: 'api/v1',
  public_path: '//qncdn.xiaoduyu.com',
  classScopedName: '[hash:base64:5]',
  GA: 'UA-87680851-1',
  // 前端静态资源上传到七牛
  qiniu: {
    accessKey: 'V7Tt-TvFyxpd0r6w0iyg6L4PkZOv0oRUsB1xymfm',
    secretKey: 'CIK0hDp3gPBBxaEA_gHyWiqVgmDldoG4a_yDg4iE',
    bucket: 'qn-cdn',
    url: '//qncdn.xiaoduyu.com'
  },
  // https 用于域名的验证的路径 [选填]
	// https://github.com/xdtianyu/scripts/blob/master/lets-encrypt/README-CN.md
	ssl_verification_path: '../../../var/www/xiaoduyu.com'
}

module.exports = process.env.NODE_ENV == 'development' ? development : production
