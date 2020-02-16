import { loadTips } from './tips';
import { loadSessionList } from './session';
import { getUserInfo } from '../reducers/user';

// 加载新的红点提醒
export const loadBadge = function() {
  return (dispatch: any, getState: any) => {
  return new Promise(async (resolve)=> {

    const me = getUserInfo(getState());
    
    if (!me) {
      resolve();
      return;
    }
    
    await loadTips()(dispatch, getState);

    // 清除所有session
    dispatch({ type: 'CLEAN_SESSION' });
    dispatch({ type: 'CLEAN_MESSAGE' });

    // 加载新的会话
    loadSessionList({ id: 'all', args:{}, restart: true })(dispatch, getState);

    resolve();

  })
  }
}