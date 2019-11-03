// 获取当前经纬度
export const getLocation = function() {
  return new Promise((resolve, reject)=>{
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(function(position) {
        resolve(position.coords)
      },
      function(err){
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
      
      // test
      // resolve({
      //   latitude: 27.571926985830434,
      //   longitude: 120.53794129958567
      // });

    } else {
      reject('该浏览器不支持获取地理位置。');
    }
  })
}
 