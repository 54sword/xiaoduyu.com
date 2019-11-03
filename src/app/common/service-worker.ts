// import * as OfflinePluginRuntime from 'offline-plugin/runtime';

export const install = function(){
  return new Promise(resolve=>{

    await navigator.serviceWorker.register();
    // OfflinePluginRuntime.install();
    resolve();
  })
}

export const update = function(){
  return new Promise(resolve=>{
    OfflinePluginRuntime.update();
    resolve();
  })
}

/*
export default function() {
  return new Promise(resolve=>{

    if (typeof window == 'undefined') return resolve();

    if (process.env.NODE_ENV == 'development') return resolve();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister()
        }
        window.location.reload();
      }).catch(err=>{
        window.location.reload();
      })
    } else {
      window.location.reload();
    }

  })
}
*/