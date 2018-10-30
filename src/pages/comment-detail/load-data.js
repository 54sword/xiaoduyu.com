import { loadCommentList } from '../../store/actions/comment';

export default ({ store, match }) => {
  return new Promise(async (resolve, reject) => {

    const { id } = match.params;

    const [ err, data ] = await loadCommentList({
      name: 'single_'+id,
      filters: {
        variables: {
          _id: id,
          deleted: false,
          weaken: false
        }
      }
    })(store.dispatch, store.getState);

    if (data && data.data && data.data.length > 0) {
      resolve({ code:200 });
    } else {
      resolve({ code:404, text: '该评论不存在' });
    }

  })
}
