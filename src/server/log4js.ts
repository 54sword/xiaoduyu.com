
// https://github.com/log4js-node/log4js-node
import log4js from 'log4js';

export default (app: any): void => {
  
  // ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
  log4js.configure({
    appenders: {

      // console: {
      //   type: "console"
      // },

      // 输出trace、debug
      _trace: {
        type: 'file',
        filename: 'logs/trace',
        pattern: "yyyy-MM-dd.log",
        alwaysIncludePattern: true,
        maxLogSize: 31457280
      },
      trace: {
        type: "logLevelFilter",
        appender: "_trace",
        level: "trace",
        maxLevel: "debug"
      },

      // 输出 info。请求日志
      _info: {
        type: 'file',
        filename: 'logs/info',
        pattern: "yyyy-MM-dd.log",
        alwaysIncludePattern: true,
        maxLogSize: 31457280
      },
      info: {
        type: "logLevelFilter",
        appender: "_info",
        level: "info",
        maxLevel: "info"
      },

      // 输出 warn、error、fatal
      _error: {
        type: 'file',
        filename: 'logs/error',
        pattern: "yyyy-MM-dd.log",
        alwaysIncludePattern: true,
        maxLogSize: 31457280
      },
      error: {
        type: "logLevelFilter",
        appender: "_error",
        level: "warn",
        maxLevel: "fatal"
      }
    },
    categories: {
      default: {
        // 在控制台显示
        appenders: ['trace', 'info', 'error'],
        level: 'all'
      }
    }
  });

  app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

  // var log = log4js.getLogger("app");
  // log.trace('Entering cheese testing');
  // log.debug('Got cheese.');
  // log.info('Cheese is Comté.');
  // log.warn('Cheese is quite smelly.');
  // log.error('Cheese is too ripe!');
  // log.fatal('Cheese was breeding ground for listeria.');

}
