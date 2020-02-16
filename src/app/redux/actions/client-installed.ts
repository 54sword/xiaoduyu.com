
import { Linking } from 'react-native';

const check = (url: string, callback: any) => {
  Linking.canOpenURL(url).then(function(result: any){
    callback(result)
  })
}

export function checkClientInstalled() {
  return (dispatch: any, getState: any) => {
    
    /*
    check('weibo://', (result: any)=>{
      if (result) dispatch({ type: 'HAS_CLIENT_INSTALLED', name: 'weibo' })
    })
    
    check('mqq://', (result: any)=>{
      if (result) dispatch({ type: 'HAS_CLIENT_INSTALLED', name: 'qq' })
    })

    check('weixin://', (result: any)=>{
      if (result) dispatch({ type: 'HAS_CLIENT_INSTALLED', name: 'weixin' })
    })
    */

  }
}
