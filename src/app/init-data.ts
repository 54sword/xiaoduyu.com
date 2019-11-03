import { loadUserInfo } from '@app/redux/actions/user';
import { loadTopicList } from '@app/redux/actions/topic';

// 首次打开时候初始化数据
// 如果有token，获取用户信息并返回, resolve([ err, user ]);
export default (store: any, accessToken?: string) => {
  return new Promise<Array<any>> (async resolve => {    

    await loadTopicList({
      id: 'parent-topics',
      args: {
        parent_id: "not-exists",
        sort_by: 'sort:-1',
        recommend: true
      }
    })(store.dispatch, store.getState);

    try {

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
