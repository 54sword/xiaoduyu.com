
var device: any = (function() {

  class Device {
    devices: any
    show: any    
    constructor() {

      this.devices = {
        1: 'unknow',
        2: 'windows',
        3: 'mac',
        4: 'ipad',
        5: 'iphone',
        6: 'android',
        7: 'ios-app',
        8: 'android-app'
      }

      this.show = {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '来自 iPhone',
        6: '来自 Android',
        7: `来自 <a href="https://www.xiaoduyu.com/app/xiaoduyu/" target="_blank" class="text-muted" >iPhone客户端</a>`,
        8: `来自 <a href="https://www.xiaoduyu.com/app/xiaoduyu/" target="_blank" class="text-muted" >Android客户端</a>`
      }
    }

    getCurrentDeviceId (): number {

      // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
      if (typeof window == 'undefined' || typeof document == 'undefined') {
        return 1
      }
  
      var dvicename = 'unknow';
      var p = navigator.platform;
      var sUserAgent: any = navigator.userAgent.toLowerCase();
      var system: any = {
        windows: p.indexOf("Win") == 0,
        mac: p.indexOf("Mac") == 0,
        ipad: sUserAgent.match(/ipad/i) == "ipad",
        iphone: sUserAgent.match(/iphone os/i) == "iphone os",
        android: sUserAgent.match(/android/i) == "android"
      };
  
      for (var i in system) {
        if (system[i]) {
          dvicename = i;
        }
      }
  
      for (var i in this.devices) {
        if (this.devices[i] == dvicename) {
          return parseInt(i);
        }
      }
  
      return 1;
    }

    getNameByDeviceId(id: number | string) {
      return this.show[id];
    }
  
    // 是否是移动设备
    isMobileDevice() {
      var id = this.getCurrentDeviceId();
      if (id == 5 || id == 6) {
        return true;
      }
      return false;
    }
  }

  return new Device();

}());

export default device;