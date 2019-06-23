import { loadPostsList } from '../../redux/actions/posts';

export default ({ store, match, user }) => {
  return new Promise(async (resolve, reject) => {

    if (user) {
      resolve({ code:200 });
      return;
    }
    
    const { id } = match.params;

    const [ err, data ] = await loadPostsList({
      id: id,
      args: {
        _id: id,
        deleted: false
      }
    })(store.dispatch, store.getState);

    if (data && data.data && data.data.length > 0) {
      resolve({ code:200 });
    } else {
      // 没有找到帖子，设置页面 http code 为404
      resolve({ code:404 });
    }

  })
}
