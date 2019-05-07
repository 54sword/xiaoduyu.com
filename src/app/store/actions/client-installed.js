
import { Linking } from 'react-native';

const check = (url, callback) => {
  Linking.canOpenURL(url).then(function(result){
    callback(result)
  })
}

export function checkClientInstalled() {
  return (dispatch, getState) => {
    
    check('weibo://', (result)=>{
      if (result) dispatch({ type: 'HAS_CLIENT_INSTALLED', name: 'weibo' })
    })
    
    check('mqq://', (result)=>{
      if (result) dispatch({ type: 'HAS_CLIENT_INSTALLED', name: 'qq' })
    })

    check('weixin://', (result)=>{
      if (result) dispatch({ type: 'HAS_CLIENT_INSTALLED', name: 'weixin' })
    })

  }
}
