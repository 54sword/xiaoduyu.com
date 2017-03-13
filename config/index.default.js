
// 开发环境配置
var development = {
  debug: true,
  // 网站名称
  name: '小度鱼',
  // 网站描述
  description: '网络社区',
  // 验证登录状态的cookie 名称
  auth_cookie_name: 'xiaoduyu',
  // ip
  host: 'localhost',
  // 端口
  port: 4000,
  // 网站地址
  url: 'http://localhost:4000',
  // API 地址
  api_url: 'https://api.xiaoduyu.com',
  // api 版本路径
  api_verstion: 'api/v1',
  // 打包文件内用到的URL路径, 比如背景图等(可以设成http的地址, 比如: http://cdn.my.com)
  public_path: 'http://localhost:4000',
  // css modules class 名称
  class_scoped_name: '[name]_[local]__[hash:base64:5]',
  // google analytics 例如：UA-00000000-1
  // 如果是空，则不启动
  GA: '',
  // 七牛配置，将前端静态资源上传到七牛（可选）
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    // 七牛的资源地址
    url: ''
  }
}

// 正式环境配置
var production = {
  debug: false,
  name: '小度鱼',
  description: '网络社区',
  auth_cookie_name: 'xiaoduyu',
  url: 'https://www.xiaoduyu.com',
  port: 4000,
  api_url: 'https://api.xiaoduyu.com',
  api_verstion: 'api/v1',
  public_path: '.',
  class_scoped_name: '[hash:base64:5]',
  GA: '',
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    url: '.'
  },
  // https 用于域名的验证的路径 [选填]
	// https://github.com/xdtianyu/scripts/blob/master/lets-encrypt/README-CN.md
	ssl_verification_path: ''
}

module.exports = process.env.NODE_ENV == 'development' ? development : production
