import { loadUserInfo } from '@app/redux/actions/user';
// import { loadOperatingStatus } from '@app/redux/actions/website';

// 首次打开时候初始化数据
// 如果有token，获取用户信息并返回, resolve([ err, user ]);
export default (store: any, accessToken?: string) => {
  return new Promise<Array<any>> (async resolve => {
    
    try {

      // await loadOperatingStatus()(store.dispatch, store.getState);

      // 如果有token，验证码token是否
      if (accessToken) {
        let res = await loadUserInfo({ accessToken })(store.dispatch, store.getState);
        resolve(res);
      } else {
        resolve([]);
      }

    } catch (err) {
      console.log(err);
      resolve([]);
    }


  });
}
