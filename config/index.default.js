
// 生产环境配置
let config = {

  // [必填] 是否开发debug模式
  debug: false,

  // [必填] 网站名称
  name: '小度鱼',

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
  
  // [选填] APP客户端下载地址
  clientDownloadUrl: {
    ios: 'https://itunes.apple.com/us/app/小度鱼/id1261181004?l=zh&ls=1&mt=8',
    android: 'https://qncdn.xiaoduyu.com/xiaoduyu-20190505.apk'
  },
  
  // [选填] 
  favicon: '<link rel="icon" href="//www.xiaoduyu.com/icon-512x512.png" type="image/png" />',

  // [选填] 添加内容到模版的head中
  head: `
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">
    <link rel="apple-touch-icon" href="//www.xiaoduyu.com/icon-512x512.png">
    <meta content="yes" name="apple-touch-fullscreen">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta data-react-helmet="true" name="apple-itunes-app" content="app-id=1261181004">
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  `,

  // [选填] 添加分析统计脚本
  analysisScript: `
  `,

  // [选填] google 分析
  GA: '',

  // [选填] google广告
  googleAdSense: {
    /*
    sidebar: {
      client: '',
      slot: '',
      style: { display: 'inline-block', width: '250px', height: '250px' }
    },
    // 详情页面的广告
    postsDetail: {
      client: '',
      slot: '',
      style: { display: 'block', height:'100px' }
      // format: 'auto',
      // responsive: 'true'
    }
    */
  },
  
  // [必填] AMP 页面相关配置
  AMP: {
    logo: {
      url: 'https://img.xiaoduyu.com/600x60.png',
      width: 600,
      height: 60
    }
  },
  
  // [选填] 友情链接
  links: [
  ]

}

config.head += config.favicon;

// 开发环境调试
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
  let localhost = 'localhost';
  config.debug = process.env.NODE_ENV == 'test' ? false : true;
  config.port = 4000;
  config.classScopedName = '[name]_[local]__[hash:base64:5]';
  config.domainName = `http://${localhost}:4000`;
  config.publicPath = `http://${localhost}:4000`;
  // config.graphqlUrl = `http://${localhost}:3000/graphql`;
  // config.socketUrl = `http://${localhost}:3000`;
  config.googleAdSense = '';
  config.GA = '';
  config.analysisScript = ``;
}


/*
// 本地生产环境调试
if (process.env.NODE_ENV == 'production') {
  config.debug = true;
  config.port = 4000;
  config.domainName = `http://${localhost}:4000`;
  config.publicPath = `http://${localhost}:4000`;
  config.GA = '';
  config.analysis_script = ``;
}
*/

module.exports = config;
