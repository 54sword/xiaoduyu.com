// import { getSunrise, getSunset } from 'sunrise-sunset-js';
// import { getLocation } from '@app/common/location';

import './global.scss';

export default async function(userinfo: any) {

  let night = false;

  if (!userinfo || userinfo && userinfo.theme == 0) {

    let res: any;

    /*
    try {
      res = await getLocation();
    } catch(err) {
      console.log(err);
    }
    */
    /*
    if (res && res.latitude && res.longitude) {
      // 日落后的2.5个小时，启动夜间主题
      const darkTime = new Date(getSunset(res.latitude, res.longitude)).getTime() + 1000 * 60 * 2.5;
      if (new Date().getTime() > darkTime) {
        night = true;
      }
    } else {
    */
      let hours = new Date().getHours();
      // console.log(hours);
      if (hours >= 21 || hours <= 6) {
        night = true;
      }
    // }

  }

  if (userinfo) {

    let theme = 'light-theme';

    if (userinfo.theme == 0) {
      theme = night ? 'dark-theme' : 'light-theme'
    } else if (userinfo.theme == 2) {
      theme = 'dark-theme';
    }

    $('html').attr('id', theme);

  } else {
    $('html').attr('id', night ? 'dark-theme' : 'light-theme');
  }
  
}