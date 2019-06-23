import merge from 'lodash/merge';
import navigationService from '../navigators/service';

let state: any = null;

export default (store: any)=>{

  state = merge({}, store.getState())
  
  return ()=>{
    
    let newStore = store.getState();
    
    // 通知更新
    if (state.website.unreadNotice.length != newStore.website.unreadNotice.length) {
      navigationService.setParamsByRouteKey({
        params: { redPoint: newStore.website.unreadNotice.length },
        key: 'Notifications',
      })
    }

    // 未读的消息
    if (state.tips['unread-message'] != newStore.tips['unread-message']) {
      navigationService.setParamsByRouteKey({
        params: { redPoint: newStore.tips['unread-message'] },
        key: 'Sessions',
      })
    }

    // 首页
    if (state.tips['feed'] != newStore.tips['feed'] || state.tips['subscribe'] != newStore.tips['subscribe']) {

      let HomeRedPoint = 0;
      
      if (newStore.tips['feed'] || newStore.tips['subscribe']) {
        HomeRedPoint = 1;
      }

      navigationService.setParamsByRouteKey({
        params: { redPoint: HomeRedPoint },
        key: 'Home'
      })

    }

    state = merge({}, newStore)

  }
}