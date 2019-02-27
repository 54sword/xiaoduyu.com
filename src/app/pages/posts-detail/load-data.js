import { loadPostsList } from '../../store/actions/posts';

export default ({ store, match }) => {
  return new Promise(async (resolve, reject) => {

    const { id } = match.params;

    const [ err, data ] = await loadPostsList({
      id: id,
      filters: {
        variables: {
          _id: id,
          deleted: false
          // weaken: false
        }
      }
    })(store.dispatch, store.getState);

    // console.log(err);
    // console.log(data);

    if (data && data.data && data.data.length > 0) {
      resolve({ code:200 });
    } else {
      // 没有找到帖子，设置页面 http code 为404
      resolve({ code:404, text: '该帖子不存在' });
    }

  })
}
