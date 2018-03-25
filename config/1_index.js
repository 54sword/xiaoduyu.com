
var config = {
  // 是否开启debug模式
  debug: false,
  // 网站名称
  name: '小度鱼',
  // 网站描述
  description: '一个网络社区',
  // 反馈邮箱（用户无法登陆或使用异常，可以通过该邮箱联系我们）
  feedback_email: '54sword@gmail.com',
  // 验证登录状态的cookie 名称
  auth_cookie_name: 'xiaoduyu',
  // 端口
  port: 86,
  // 网站地址
  domain_name: 'https://www.xiaoduyu.com',
  // 打包文件内用到的URL路径, 比如背景图等(可以设成http的地址, 比如: http://cdn.my.com)
  public_path: '//qncdn.xiaoduyu.com',
  // API 地址
  api_url: 'https://www.xiaoduyu.com',
  // 原始的api地址，在第三方登陆使用
  original_api_url: 'https://api.xiaoduyu.com',
  // api 版本路径
  api_verstion: 'api/v1',
  // css modules class 名称
  class_scoped_name: '[name]_[local]__[hash:base64:5]',
  // google 分析
  GA: 'UA-87680851-1',
  // 添加分析统计脚本，字符串
  analysis_script: `
    <script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1266880810'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s13.cnzz.com/z_stat.php%3Fid%3D1266880810' type='text/javascript'%3E%3C/script%3E"));</script>
    <script src="https://cdn.ravenjs.com/3.20.1/raven.min.js" crossorigin="anonymous"></script>
    <script>Raven.config('https://6264dd0a4642410b9fc2d65fcc5a3b2c@sentry.io/255376').install()</script>
    `,
  // 前端静态资源上传到七牛
  qiniu: {
    accessKey: 'V7Tt-TvFyxpd0r6w0iyg6L4PkZOv0oRUsB1xymfm',
    secretKey: 'CIK0hDp3gPBBxaEA_gHyWiqVgmDldoG4a_yDg4iE',
    bucket: 'qn-cdn',
    url: '//qncdn.xiaoduyu.com'
  },
  // https 用于域名的验证的路径 [选填]
	// https://github.com/xdtianyu/scripts/blob/master/lets-encrypt/README-CN.md
	ssl_verification_path: '../../../../var/www/xiaoduyu.com'
}

if (process.env.NODE_ENV == 'development') {
  config.debug = true
  config.port = 4000
  // config.api_url = 'http://192.168.1.106:3000'
  // config.original_api_url = 'http://192.168.1.106:3000'
  config.domain_name = 'http://192.168.1.106:4000'
  config.public_path = 'http://192.168.1.106:4000'
  config.GA = ''
  config.ssl_verification_path = ''
}

module.exports = config
