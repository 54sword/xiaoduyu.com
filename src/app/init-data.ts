
import { loadUserInfo } from '@actions/user';
// import { loadOperatingStatus } from '@actions/website';

// 初始化数据
// redux 中的数据清理、以及准备一些经常不变的数据
export default (store: any, accessToken: string) => {
  return new Promise (async resolve => {
    
    // await loadOperatingStatus()(store.dispatch, store.getState);

    if (accessToken) {
      let res = await loadUserInfo({ accessToken })(store.dispatch, store.getState);
      resolve(res);
    } else {
      resolve([]);
    }

  });
}
