
var device = (function() {

  var Device = function() {
    this.devices = {
      1: 'unknow',
      2: 'windows',
      3: 'mac',
      4: 'ipad',
      5: 'iphone',
      6: 'android'
    };
    this.show = {
      1: '',
      2: '',
      3: '',
      4: '来自 iPad',
      5: '来自 iPhone',
      6: '来自 Android'
    };
  };

  Device.prototype.getCurrentDeviceId = function() {
    
    // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
    if (typeof window == 'undefined' || typeof document == 'undefined') {
      return 1
    }

    var dvicename = 'unknow';
    var p = navigator.platform;
    var sUserAgent = navigator.userAgent.toLowerCase();
    var system = {
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
        return i;
      }
    }

    return 1;
  };

  Device.prototype.getNameByDeviceId = function(id) {
    return this.show[id];
  };

  // 是否是移动设备
  Device.prototype.isMobileDevice = function() {
    var id = this.getCurrentDeviceId();
    if (id == 5 || id == 6) {
      return true;
    }
    return false;
  };

  var device = new Device();

  return device;

}());

export default device;
