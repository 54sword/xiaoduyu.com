
// 生产环境配置
let config = {

  name: '小度鱼',

  // 联系我们的邮箱地址
  contact_email: '***@gmail.com',

  // 备案号
  ICP_number: '浙ICP备14013796号-3',

  debug: false,

  // 服务端口
  port: 4000,

  // 设置缓存有效时间（毫秒单位），0为不缓存
  // 缓存机制：游客所有的请求、会员更新频率低的请求
  cache: 1000 * 60 * 5,

  // 域名完整地址
  domain_name: 'http://localhost:4000',

  // 认证cookie名称（储存Token）
  auth_cookie_name: 'token',

  // https://github.com/css-modules/css-modules
  class_scoped_name: '[hash:base64:8]',

  // 客户端打包后(dist/client/*)，静态资源域名
  public_path: 'http://localhost:4000',
  
  // 原始的api域名，第三方登录的时候，跳转使用
  original_api_domain: 'https://api.xiaoduyu.com',

  // graphql api 地址
  graphql_url: 'https://www.xiaoduyu.com/graphql',

  // websocket 链接地址
  socket_url: 'https://www.xiaoduyu.com',

  // APP客户端下载地址
  client_download_url: null, //{ ios: '', android: '' },
  
  favicon: '<link rel="icon" href="//www.xiaoduyu.com/icon-512x512.png" type="image/png" />',

  // 添加内容到模版的head中
  head: `
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">
    <link rel="apple-touch-icon" href="//www.xiaoduyu.com/icon-512x512.png">
    <meta content="yes" name="apple-touch-fullscreen">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta data-react-helmet="true" name="apple-itunes-app" content="app-id=1261181004">
  `,

  // 添加分析统计脚本
  analysis_script: ``,

  // google 分析 
  // UA-*****-1
  GA: '',

  // google广告
  Goole_AdSense: {
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

  // amp 配置
  amp: {
    logo: {
      url: 'https://img.xiaoduyu.com/600x60.png',
      width: 600,
      height: 60
    }
  }

}

config.head += config.favicon;

// 开发环境调试
if (process.env.NODE_ENV == 'development') {
  config.debug = true;
  config.port = 4000;
  config.class_scoped_name = '[name]_[local]__[hash:base64:5]';
  config.domain_name = 'http://localhost:4000';
  config.public_path = 'http://localhost:4000';
  // config.graphql_url = 'http://localhost:3000/graphql';
  // config.socket_url = 'http://localhost:3000';
  config.GA = '';
  config.analysis_script = ``;
}

module.exports = config;
