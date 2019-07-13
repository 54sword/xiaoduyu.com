
// 生产环境配置
let config = {

  // [必填] 网站名称
  name: '小度鱼',

  // 网站描述
  description: '年轻人的交流社区',

  // [选填] 联系我们的邮箱地址
  contactEmail: '***@163.com',

  // [选填] 备案号
  ICPNumber: '',
  
  // [选填] 公网安备号
  gongWangAnBei: '',

  // [必填] 服务端口
  port: 4000,

  // [必填] 域名完整地址
  domainName: 'http://localhost:4000',

  // [必填] 身份验证的cookie名称（储存Token）
  authCookieName: 'xiaoduyu',

  // [必填] https://github.com/css-modules/css-modules
  classScopedName: '[hash:base64:8]',
  
  // [必填] 客户端打包后(dist/client/*)，静态资源域名
  publicPath: '//localhost:4000',
  
  // [必填] 域名，第三方登录的时候，跳转使用
  APIDomainName: 'https://api.xiaoduyu.com',

  // [必填]  graphql api 地址
  graphqlUrl: 'https://www.xiaoduyu.com/graphql',
  
  // [必填] websocket 链接地址
  socketUrl: 'https://www.xiaoduyu.com',

  sentry: '',
  
  // [选填] APP客户端下载地址
  clientDownloadUrl: {
    ios: '',
    android: ''
  },
  
  // [选填] 
  favicon: '<link rel="icon" href="/icon-512x512.png" type="image/png" />',

  // [选填] 添加内容到模版的head中
  head: `
    <meta name="description" content="{description}">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">
    <link rel="apple-touch-icon" href="/icon-512x512.png">
    <meta content="yes" name="apple-touch-fullscreen">
    <meta content="yes" name="apple-mobile-web-app-capable">
  `,

  // [选填] 添加分析统计脚本
  analysisScript: `
  `,

  qiniu: {
    // 七牛上传地址
    uploadUrl: {
      http: 'http://upload.qiniu.com',
      https: 'https://up.qbox.me/'
    }
  },

  // [选填] google 分析
  GA: '',

  // [选填] google广告
  googleAdSense: {
    // client: '',
    // slot: {
    //   pc: '',
    //   h5: ''
    // }
  },
  
  // [必填] AMP 页面相关配置
  AMP: {
    logo: {
      url: '/600x60.png',
      width: 600,
      height: 60
    }
  }

}

const localhost = 'localhost';

// 开发环境调试
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
  config.port = 4000;
  config.classScopedName = '[name]_[local]__[hash:base64:5]';
  config.domainName = `http://${localhost}:4000`;
  config.publicPath = `http://${localhost}:4000`;
  // config.graphqlUrl = `http://${localhost}:3000/graphql`;
  // config.socketUrl = `http://${localhost}:3000`;
  config.GA = '';
  config.googleAdSense = '';
  config.analysisScript = ``;
}


// 上线环境测试
// config.port = 4000;
// config.domainName = `http://${localhost}:4000`;
// config.publicPath = `http://${localhost}:4000`;
// config.graphqlUrl = `http://${localhost}:3000/graphql`;
// config.socketUrl = `http://${localhost}:3000`;

config.head += config.favicon;
config.AMP.logo.url = config.domainName + config.AMP.logo.url;

module.exports = config;
