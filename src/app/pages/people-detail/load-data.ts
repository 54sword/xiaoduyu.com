import { loadPeopleList } from '@app/redux/actions/people';

export default function({ store, match, user }: any) {
  return new Promise(async (resolve, reject) => {
    
    if (user) {
      resolve({ code:200 });
      return;
    }
    
    const { id } = match.params;

    const [ err, data ] = await loadPeopleList({
      id,
      args: {
        _id: id,
        blocked: false
      }
    })(store.dispatch, store.getState);

    // 没有找到帖子，设置页面 http code 为404
    if (err || !data || data.length == 0) {
      resolve({ code: 404, text: '该用户不存在' });
    } else {
      resolve({ code: 200 });
    }

  })
}
