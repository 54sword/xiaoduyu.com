import { loadPostsList } from '../../redux/actions/posts';
import { loadCommentList } from '../../redux/actions/comment';

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

      let posts = data.data[0];

      await loadCommentList({
        id: posts._id,
        args: {
          deleted: false,
          weaken: false,
          posts_id: posts._id,
          parent_id: 'not-exists',
          page_size:100,
          page_number: Math.ceil(posts.comment_count/100)
        }
      })(store.dispatch, store.getState);

      resolve({ code:200 });
    } else if (data && data.data && data.data[0]) {
      // 没有找到帖子，设置页面 http code 为404
      resolve({ code:404 });
    } else if (err && err.message) {
      resolve({ code:200 });
    }

  })
}
