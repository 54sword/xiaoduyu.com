import graphql from '../utils/graphql';
import loadList from '../utils/new-graphql-load-list';

export const loadBlockList = loadList({
  reducerName: 'block',
  actionType: 'SET_BLOCK_LIST_BY_ID',
  api: 'blocks',
  fields: `
    _id
    deleted
    create_at
    ip
    user_id
    comment_id {
      _id
      content_html
      posts_id
      parent_id
    }
    people_id {
      create_at
      avatar
      _id
      nickname
      avatar_url
      id
    }
    posts_id {
      title
      _id
    }
  `
});

export const addBlock = ({ args }: any) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'addBlock',
          args,
          fields: `
          success
          _id  
          `
        }],
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([err, res]);

      if (err || !res || !res.success) return;

      let userInfo = getState().user.userInfo;

      // 更新个人资料里面的累计数
      if (args.people_id) {
        if (!userInfo.block_people_count) {
          userInfo.block_people_count = 1;
        } else {
          userInfo.block_people_count += 1;
        }

      } else if (args.posts_id) {
        if (!userInfo.block_posts_count) {
          userInfo.block_posts_count = 1;
        } else {
          userInfo.block_posts_count += 1;
        }

        dispatch({ type: 'REMOVE_POSTS_BY_ID', id: args.posts_id });
      } else if (args.comment_id) {
        if (!userInfo.block_comment_count) {
          userInfo.block_comment_count = 1;
        } else {
          userInfo.block_comment_count += 1;
        }
        dispatch({ type: 'REMOVE_COMMENT_BY_ID', id: args.comment_id });
      }

      dispatch({ type: 'SET_USER', userinfo: userInfo });
      dispatch({ type: 'SET_BLOCK_STATE', state: {} });

    })
  }
}

export const removeBlock = ({ args, id }: any) => {
  return (dispatch: any, getState: any) => {
    return new Promise(async resolve => {

      let user = getState().user;

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'removeBlock',
          args,
          fields: `success`
        }],
        headers: { accessToken: user.accessToken }
      });

      resolve([err, res]);

      if (err || !res || !res.success) return;

      // 删除该条数据
      dispatch({ type: 'REMOVE_BLOCK_BY_ID', id });

      // 更新个人资料里面的累计数
      if (args.people_id) {
        user.userInfo.block_people_count -= 1;
      } else if (args.posts_id) {
        user.userInfo.block_posts_count -= 1;
      } else if (args.comment_id) {
        user.userInfo.block_comment_count -= 1;
      }

      dispatch({ type: 'SET_USER', userinfo: user.userInfo });

    })
  }
}
