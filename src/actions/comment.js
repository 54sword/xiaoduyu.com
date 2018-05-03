
import { DateDiff } from '../common/date';

import loadList from './common/new-load-list';
import graphql from './common/graphql';

const processCommentList = (list) => {
  list.map(item=>{

    if (item.create_at) {
      item._create_at = DateDiff(item.create_at);
    }
    
    if (item.content_html) {
      let text = item.content_html.replace(/<[^>]+>/g,"");
      if (text.length > 200) text = text.slice(0, 200)+'...';
      item.content_summary = text;
    } else {
      item.content_summary = '';
    }

    if (item.reply && item.reply.map) {
      item.reply = processCommentList(item.reply);
    }

  })
  return list
}

export function addComment({ posts_id, parent_id, reply_id, contentJSON, contentHTML, deviceId, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken;
    let commentState = getState().comment;

    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addComment',
        args: {
          posts_id,
          parent_id,
          reply_id,
          content: contentJSON,
          content_html: contentHTML,
          device: deviceId
        },
        fields: `
          success
          _id
        `,
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([ err, res ]);

      if (res && res.success) {
        [ err, res ] = await loadCommentList({ name:'cache', filters: { query: { _id:res._id } }, restart: true })(dispatch, getState);

        let newComment = res.data[0];

        for (let i in commentState) {
          // 添加评论
          if (i == posts_id ) {
            if (!newComment.parent_id) {
              // 评论
              commentState[i].data.push(newComment);
            } else {
              // 回复
              commentState[i].data.map(item=>{
                if (item._id == newComment.parent_id) {
                  item.reply.push(newComment);
                }
              })
            }
          } else if (i == parent_id) {
            commentState[i].data.push(newComment);
          }
        }

        dispatch({ type: 'SET_COMMENT', state: commentState });

      }

    });

  }
}

export function loadCommentList({ name, filters = {}, restart = false }) {
  return (dispatch, getState) => {

    if (!filters.select) {
      filters.select = `
        content_html
        create_at
        reply_count
        like_count
        device
        ip
        blocked
        deleted
        verify
        weaken
        recommend
        _id
        update_at
        like
        user_id {
          _id
          nickname
          brief
          avatar_url
        }
        posts_id{
          _id
          title
        }
        parent_id
        reply_id {
          _id
          user_id{
            _id
            nickname
            brief
            avatar_url
          }
        }
        reply {
          _id
          user_id {
            _id
            nickname
            brief
            avatar
            avatar_url
          }
          posts_id
          parent_id
          reply_id {
            user_id {
              _id
              nickname
              brief
              avatar
              avatar_url
            }
          }
          update_at
          weaken
          device
          like_count
          create_at
          content_html
          like
        }
      `
    }

    return loadList({
      dispatch,
      getState,

      name,
      restart,
      filters,

      processList: processCommentList,

      schemaName: 'comments',
      reducerName: 'comment',
      api: '/comments',
      actionType: 'SET_COMMENT_LIST_BY_NAME'
    })
  }
}


export function updateComment(filters) {
  return (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {

    let [ err, res ] = await graphql({
      type: 'mutation',
      api: 'updateComment',
      args: filters,
      fields: `
        success
      `,
      headers: { accessToken: getState().user.accessToken }
    });


    if (err) return resolve([err])

    let _id = filters._id

    delete filters._id

    dispatch({ type: 'UPDATE_COMMENT', id: _id, update: processCommentList([filters])[0] });

    resolve([null])

  })
  }
}
