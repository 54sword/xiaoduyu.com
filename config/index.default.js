
// 生产环境配置
let config = {
  
  // debug 总开关
  debug: false,

  // [必填] 服务端口
  port: 4000,

  // [必填] 网站域名完整地址
  domainName: 'http://localhost:4000',

  // [必填] 网站名称
  name: '小度鱼',

  // [必填] 网站描述
  description: '小度鱼是一个年轻人的交流社区，我们交流分享想法、发现生活乐趣、探索有趣好玩的事情！',

  // [选填] 联系我们的邮箱地址
  contactEmail: 'hi@abcd.com',

  // [选填] 备案号
  ICPNumber: '',
  
  // [选填] 公网安备号
  gongWangAnBei: '',

  // [必填] 身份验证的cookie名称（储存Token）
  authCookieName: 'token',

  // [必填] https://github.com/css-modules/css-modules
  classScopedName: '[hash:base64:5]',
  
  // 客户端打包后(dist/client/*)静态资源的前缀域名
  publicPath: '',

  api: {
    // [必填] 域名，第三方登录的时候，跳转使用
    domain: 'https://api.xiaoduyu.com',
    graphql: {
      // [必填] graphql 客户端 api
      client: 'https://api.xiaoduyu.com/graphql',
      // [选填] graphql 服务端 api，如果前端和后端api是在同一台服务器的话，建议使用本机127.0.0.1速度会更快，
      // 例如: http://127.0.0.1:3000/graphql
      server: 'https://api.xiaoduyu.com/graphql'
    },
    // [必填] websocket 地址
    socket: 'https://www.xiaoduyu.com'
  },

  // [选填] google 分析
  GA: '',

  // [选填] google广告
  googleAdSense: {
    client: '',
    slot: {
      pc: '',
      h5: ''
    }
  },
  
  // 社交账号登陆，需api支持
  social: {
    weibo: true,
    qq: true,
    github: true,
    wechat: false
  },
  
  // [选填] 图片文件在public/512x512.png
  favicon: '<link rel="icon" href="/favicon.png" type="image/png" />',

  // [选填] 添加内容到模版的head中
  head: `
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">
    <link rel="apple-touch-icon" href="/512x512.png">
    <meta content="yes" name="apple-touch-fullscreen">
    <meta content="yes" name="apple-mobile-web-app-capable">
  `,

  // [选填] 添加分析统计脚本
  analysisScript: ``,

  qiniu: {
    // 七牛上传地址
    uploadUrl: {
      http: 'http://upload.qiniu.com',
      https: 'https://up.qbox.me/'
    },
    // cdn 域名
    domain: ''
  },
  
  // [必填] AMP 页面相关配置
  AMP: {
    logo: {
      // 图片文件在 public/600x60.png
      url: '/600x60.png',
      width: 600,
      height: 60
    }
  },

  agora: {
    appid: ''
  }

}

config.head += config.favicon;
config.AMP.logo.url = config.domainName + config.AMP.logo.url;

const localhost = 'localhost';

// 开发环境调试
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
  config.debug = process.env.NODE_ENV == 'development' ? true : false;
  config.port = 4000;
  config.classScopedName = '[name]_[local]__[hash:base64:5]';
  config.publicPath = `http://${localhost}:4000`;
  config.api.domain = `http://${localhost}:4000`;
  // config.api.graphql.client = `http://${localhost}:3000/graphql`;
  // config.api.graphql.server = '';
  // config.api.socket = `http://${localhost}:3000`;
  config.GA = '';
  config.googleAdSense = '';
  config.analysisScript = ``;
  config.sentry = '';
}

module.exports = config;
