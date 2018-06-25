
// 生产环境配置
let config = {

  // 正式环境
  debug: false,

  name: '小度鱼',

  // logo: '//localhost:4000/logo.png',

  // 添加内容到模版的head中
  head: `
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">
  `,

  // 联系我们的邮箱地址
  contact_email: '54sword@gmail.com',

  // 域名全地址
  domain_name: 'http://localhost:4000',

  //  服务端口
  port: 4000,

  // 登录 token cookie 的名称
  auth_cookie_name: 'xiaoduyu',

  // https://github.com/css-modules/css-modules
  class_scoped_name: '[hash:base64:8]',

  // 前端打包后，静态资源路径前缀
  // 生成效果如：//localhost:4000/app.bundle.js
  public_path: '//localhost:4000',

  // 原始的api域名，第三方登录的时候，跳转使用
  original_api_domain: 'https://api.xiaoduyu.com',

  // graphql api 地址
  graphql_url: 'https://www.xiaoduyu.com/graphql',

  // websocket 链接地址
  socket_url: 'https://www.xiaoduyu.com',

  // google 分析
  GA: '',
  // 添加分析统计脚本，字符串
  analysis_script: ``,

  // amp 配置
  amp: {
    logo: {
      url: 'https://imgs.huarenhouse.com/logo-600-60.png',
      width: '600',
      height: '60'
    }
  },

  // https 用于域名的验证的路径 [选填]
	// https://github.com/xdtianyu/scripts/blob/master/lets-encrypt/README-CN.md
	ssl_verification_path: '',

  // 用于将前端静态资源上传到七牛
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    // 静态资源域名
    url: '//qncdn.xiaoduyu.com'
  }

}

// 开发环境配置
if (process.env.NODE_ENV == 'development') {
  config.debug = true
  config.port = 4000
  config.class_scoped_name = '[name]_[local]__[hash:base64:5]'
  config.domain_name = 'http://localhost:4000'
  config.public_path = '//localhost:4000'
  // config.graphql_url = 'http://localhost:3000/graphql'
  // config.socket_url = 'http://localhost:3000'
  config.GA = ''
  config.analysis_script = ''
  config.ssl_verification_path = ''
}

module.exports = config
