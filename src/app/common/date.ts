
// 倒计时
const Countdown = function(nowDate: string | number, endDate: string | number) {

  var lastDate = Math.ceil(new Date(endDate).getTime()/1000)
  var now = Math.ceil(new Date(nowDate).getTime()/1000)

  var timeCount = (3600 * 24 * 30) - (now - lastDate)

  var days = Math.floor( timeCount / (3600*24) )
  var hours = Math.floor( (timeCount - (3600*24*days)) / 3600 )
  var mintues = Math.floor( (timeCount - (3600*24*days) - (hours*3600)) / 60)
  var seconds = timeCount - (3600*24*days) - (3600*hours) - (60*mintues)

  return {
    days: days,
    hours: hours,
    mintues: mintues,
    seconds: seconds
  }

}

const pad = function(number: number, digits: number) {
  return new Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
};

const getDateArray = function(date: number | string) {
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
const DateDiff = function(date1: string | number, date2?: string | number) {


  if (!date2) {
    date2 = new Date().getTime()
  }

  var start = Math.ceil(new Date(date1).getTime()/1000);
  var end = Math.ceil(new Date(date2).getTime()/1000);

  var timestamp: number = end - start;
  var time = date1;

  switch (true) {
    // 一秒内
    case timestamp < 1:
      time = '刚刚';
      break;
    // 一分钟内
    case timestamp < 60:
      time = timestamp + '秒前';
      break;
    // 一小时内
    case timestamp >= 60 && timestamp < 3600:
      time = Math.floor(timestamp / 60) + '分钟前';
      break;
    // 一天内
    case timestamp >= 3600 && timestamp < 86400:
      // var dateArr = getDateArray(date1);
      // time = '今天 '+dateArr[3]+':'+dateArr[4];

      var hours = Math.floor(timestamp / 3600);
      var minutes = Math.floor( (timestamp - (3600 * hours) ) / 60 );
      time = hours + '小时前';
      break;
    case timestamp >= 86400 && timestamp < 2592000:
      time = Math.floor(timestamp / 86400) + '天前';
      break;
    // 一年内
    case timestamp >= 2592000 && timestamp < 604800:
      // var dateArr = getDateArray(date1);
      // time = Math.floor(dateArr[1])+'月'+Math.floor(dateArr[2])+'日 '+dateArr[3]+':'+dateArr[4];
      time = Math.floor(timestamp / 86400) + '天前';
      break;
    default:
      var dateArr = getDateArray(date1);

      if (dateArr[0] == new Date().getFullYear()) {
        // time = dateArr[1]+'-'+dateArr[2] + ' '+dateArr[3]+':'+dateArr[4];
        time = dateArr[1]+'月'+dateArr[2]+'日';
      } else {
        // time = dateArr[0]+'-'+dateArr[1]+'-'+dateArr[2] + ' '+dateArr[3]+':'+dateArr[4];
        time = dateArr[0]+'年'+dateArr[1]+'月'+dateArr[2]+'日';
      }


      // time = dateArr[0]+'年'+parseInt(dateArr[1])+'月';
  }

  return time;
}

export {
  Countdown,
  pad,
  getDateArray,
  DateDiff
}