import { loadCommentList } from '@app/redux/actions/comment';

export default ({ store, match, user }: any) => {
  return new Promise(async (resolve, reject) => {

    if (user) {
      resolve({ code:200 });
      return;
    }

    const { id } = match.params;
    
    let [ err, data ]: any = await loadCommentList({
      id: 'single_'+id,
      args: {
        _id: id,
        deleted: false,
        weaken: false
      },
      fields: `
        posts_id{
          _id
          title
          content_html
        }
        content_html
        create_at
        reply_count
        like_count
        _id
        user_id {
          _id
          nickname
          avatar_url
        }
      `
    })(store.dispatch, store.getState);

    if (data && data.data && data.data.length > 0) {
      resolve({ code:200 });
    } else {
      resolve({ code:404 });
    }

  })
}
