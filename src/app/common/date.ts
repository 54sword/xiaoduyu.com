// 获取两日期时间的倒数时间
type Countdown = { days: number, hours: number, mintues: number, seconds: number }

const getCountdown = function(nowDate: string | number, endDate: string | number): Countdown {

  var lastDate = Math.ceil(new Date(endDate).getTime()/1000);
  var now = Math.ceil(new Date(nowDate).getTime()/1000);
  
  var timeCount = lastDate - now;

  var days = Math.floor( timeCount / (3600*24) );
  var hours = Math.floor( (timeCount - (3600*24*days)) / 3600 );
  var mintues = Math.floor( (timeCount - (3600*24*days) - (hours*3600)) / 60);
  var seconds = timeCount - (3600*24*days) - (3600*hours) - (60*mintues);

  return {
    days: days,
    hours: hours,
    mintues: mintues,
    seconds: seconds
  }

}

const pad = function(number: number, digits: number) {
  return new Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number;
};

const getDateArray = function(date: number | string): Array<any> {
  const _date = date ? new Date(date) : new Date();
  return [
    _date.getFullYear(),
    pad(_date.getMonth()+1, 2),
    pad(_date.getDate(), 2),
    pad(_date.getHours(), 2),
    pad(_date.getMinutes(), 2),
    pad(_date.getSeconds(), 2),
    pad(_date.getMilliseconds(), 2)
  ];
}


// 计算两个日期的间隔时间
const dateDiff = function(date1: string | number, date2?: string | number) {

  if (!date2) date2 = new Date().getTime();

  var start = Math.ceil(new Date(date1).getTime()/1000);
  var end = Math.ceil(new Date(date2).getTime()/1000);

  var timestamp: number = end - start;
  var time = date1;

  switch (true) {

    // 一秒内
    case timestamp <= 1:
      time = '刚刚';
      break;

    // 一分钟内
    case timestamp <= 60:
      time = timestamp + '秒前';
      break;

    // 一小时内
    case timestamp <= 3600:
      time = Math.floor(timestamp / 60) + '分钟前';
      break;
    
    // 一天内
    // case timestamp <= 86400:
      // var hours = Math.floor(timestamp / 3600);
      // var minutes = Math.floor( (timestamp - (3600 * hours) ) / 60 );
      // time = hours + '小时前';
      // var dateArr = getDateArray(date1);
      // time = '今天 '+dateArr[3]+':'+dateArr[4];
      // break;
      
    default:
      var dateArr = getDateArray(date1);
      var nowArr = getDateArray(new Date().getTime());
      
      // 今天
      if (dateArr[0] == nowArr[0] && dateArr[1] == nowArr[1] && nowArr[2] == dateArr[2]) {
        time = '今天 '+dateArr[3]+':'+dateArr[4];
      } // 昨天
      else if (dateArr[0] == nowArr[0] && dateArr[1] == nowArr[1] && parseInt(nowArr[2]) - parseInt(dateArr[2]) == 1) {
        time = '昨天 '+dateArr[3]+':'+dateArr[4];
      } // 前天
      else if (dateArr[0] == nowArr[0] && dateArr[1] == nowArr[1] && parseInt(nowArr[2]) - parseInt(dateArr[2]) == 2) {
        time = '前天 '+dateArr[3]+':'+dateArr[4];
      } // 同年内
      else if (dateArr[0] == nowArr[0]) {
        // time = Math.floor(dateArr[1])+'/'+Math.floor(dateArr[2]);
        // time = dateArr[0]+'/'+dateArr[1]+'/'+dateArr[2];
        time = Math.floor(dateArr[1])+'月'+Math.floor(dateArr[2])+'日';
        // time = Math.floor(dateArr[1])+'月'+Math.floor(dateArr[2])+'日 '+dateArr[3]+':'+dateArr[4];
      } // 不同年
      else {
        time = dateArr[0]+'/'+dateArr[1]+'/'+dateArr[2];
        // time = dateArr[0]+'年'+dateArr[1]+'月'+dateArr[2]+'日';
      }
  }

  return time;
}


export {
  getCountdown,
  getDateArray,
  dateDiff
}