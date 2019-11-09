import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import * as globalData from '../app/common/global-data';

const ServiceWorker = {

  get: function() {
    return new Promise(resolve=>{
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          resolve(registrations);
        })
      } else {
        resolve(null)
      }
    })
  },

  install: function(){
    return new Promise(resolve=>{
      if (process.env.NODE_ENV != 'development') {
        OfflinePluginRuntime.install();
      }
      resolve();
    })
  },

  uninstall: function(){
    return new Promise(async resolve=>{
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const registration of registrations) {
            registration.unregister()
          }
          resolve();
        }).catch(err=>{
          resolve();
        })
      } else {
        resolve();
      }

    })
  }

}

export default ServiceWorker;

globalData.set('service-worker', ServiceWorker);
// ServiceWorker.install();