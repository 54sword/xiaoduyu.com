
// 开发环境配置
var development = {
  debug: true,
  // 网站名称
  name: '小度鱼',
  // 网站描述
  description: '社群问答社区',
  // ip
  host: 'localhost',
  // 端口
  port: 4000,
  url: 'http://localhost:3000',
  // API 地址
  api_url: 'https://api.xiaoduyu.com',
  // api 版本路径  http://192.168.0.105:3000/api/v1
  api_verstion: 'api/v1',
  // 打包文件内用到的URL路径, 比如背景图等(可以设成http的地址, 比如: http://cdn.my.com)
  public_path: 'http://localhost:3000',
  // google analytics
  GA: 'UA-****-1',
  // 七牛配置
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
  description: '社群问答社区',
  url: 'https://www.xiaoduyu.com',
  port: 84,
  api_url: 'https://api.xiaoduyu.com',
  api_verstion: 'api/v1',
  public_path: '',
  GA: 'UA-****-1',
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    url: ''
  }
}

module.exports = process.env.NODE_ENV == 'development' ? development : production
