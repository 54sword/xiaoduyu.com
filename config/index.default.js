
var config = {
  // 是否开启debug模式
  debug: false,
  // 网站名称
  name: '小度鱼',
  // 网站描述
  description: '一个网络社区',
  // 验证登录状态的cookie 名称
  auth_cookie_name: 'xiaoduyu',
  // 端口
  port: 4000,
  // 网站地址
  domain_name: 'http://localhost:4000',
  // 打包文件内用到的URL路径, 比如背景图等(可以设成http的地址, 比如: http://cdn.my.com)
  public_path: 'http://localhost:4000',
  // API 地址
  api_url: 'https://api.xiaoduyu.com',
  // api 版本路径
  api_verstion: 'api/v1',
  // css modules class 名称
  class_scoped_name: '[name]_[local]__[hash:base64:5]',
  // google 分析
  GA: '',
  // 前端静态资源上传到七牛
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    url: '//xxxxxxxxx'
  },
  // https 用于域名的验证的路径
	// https://github.com/xdtianyu/scripts/blob/master/lets-encrypt/README-CN.md
	ssl_verification_path: ''
}

if (process.env.NODE_ENV == 'development') {
  config.debug = true
  config.port = 4000
  config.api_url = 'http://localhost:3000'
  config.domain_name = 'http://localhost:4000'
  config.public_path = 'http://localhost:4000'
  config.GA = ''
  config.ssl_verification_path = ''
}

module.exports = config
