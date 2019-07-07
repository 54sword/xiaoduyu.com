import { dateDiff } from '../../common/date';
// import loadList from '../../common/graphql-load-list';
import graphql from '../../common/graphql';
import loadList from '../../common/new-graphql-load-list';

import Device from '../../common/device';

const abstractImages = (str) => {

  let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  let result = [];
  let img;
  while (img = imgReg.exec(str)) {
    let _img = img[0].match(srcReg)
    if (_img && _img[1]) {
      _img = _img[1] + '?imageView2/2/w/800/auto-orient/format/jpg'
      result.push(_img)
    }
  }

  return result

}

const processCommentList = (list: Array<object>) => {
  list.map((item: any)=>{

    if (item.device) {
      item._device = Device.getNameByDeviceId(item.device);
    }

    if (item.create_at) item._create_at = dateDiff(item.create_at);
    if (item.update_at) item._update_at = dateDiff(item.update_at);

    item.images = abstractImages(item.content_html);

    if (item.images && item.images.length > 0) {
      item._coverImage = item.images[0].split('?')[0]+'?imageView2/2/w/300/auto-orient/format/jpg'
    }
    
    if (item.content_html) {
      let text = item.content_html.replace(/<[^>]+>/g,"");
      if (text.length > 137) text = text.slice(0, 137)+'...';
      item.content_summary = text;
    } else {
      item.content_summary = '';
    }

    if (item.posts_id && item.posts_id.content_html) {
      let text = item.posts_id.content_html.replace(/<[^>]+>/g,"");
      if (text.length > 137) text = text.slice(0, 137)+'...';
      item.posts_id.content_summary = text;
    }

    if (item.reply && item.reply.map) {
      item.reply = processCommentList(item.reply);
    }

  })
  return list
}

export function addComment({ posts_id, parent_id, reply_id, contentJSON, contentHTML, deviceId, forward, callback }: any) {
  return (dispatch: any, getState: any) => {

    let accessToken = getState().user.accessToken;
    let commentState = getState().comment;
    let postsState = getState().posts;

    return new Promise(async resolve => {

      let err: any, res: any;

      [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'addComment',
          args: {
            posts_id,
            parent_id,
            reply_id,
            content: contentJSON,
            content_html: contentHTML,
            device: deviceId,
            forward
          },
          fields: `
          success
          _id
          `
        }],
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([ err, res ]);

      if (!res || !res.success) return;

      [ err, res ] = await loadCommentList({ id: 'cache', args:{ _id: res._id }, restart: true })(dispatch, getState);

      let newComment = res.data[0];

      for (let i in commentState) {
        // 添加评论
        if (i == posts_id ) {
          if (!newComment.parent_id) {
            // 评论
            commentState[i].data.push(newComment);
          } else {
            // 回复
            commentState[i].data.map((item: any)=>{
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


      // 如果是评论，那么对该评论的帖子，评论累计数+1
      if (!parent_id) {

        for (let i in postsState) {
          postsState[i].data.map((posts: any)=>{
            if (posts._id == posts_id) {
              posts.comment_count = posts.comment_count ? posts.comment_count + 1 : 1;
            }
          });
        }

        dispatch({ type: 'SET_POSTS', state: postsState });
      }

    });

  }
}


export const loadCommentList = loadList({
  reducerName: 'comment',
  actionType: 'SET_COMMENT_LIST_BY_ID',
  api: 'comments',
  fields: `
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
  `,
  processList: processCommentList
});

export function loadMoreReply({ postsId, commentId }) {
  return (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {

    const commentList = getState().comment[postsId];

    let index = 0;
    let comment = null;

    commentList.data.map((item, key)=>{
      if (item._id == commentId) {
        comment = item;
        index = key;
      }
    });
    
    let [ err, res ] = await loadCommentList({
      name:'new-reply',
      args: {
        parent_id: comment._id,
        page_size: 10,
        deleted: false,
        weaken: false,
        start_create_at: comment.reply[comment.reply.length - 1].create_at
      },
      restart: true
    })(dispatch, getState);

    if (err) {
      resolve();
      return;
    }

    res.data.map(item=>{
      comment.reply.push(item);
    });

    commentList.data[index] = comment;

    dispatch({ type: 'SET_COMMENT_LIST_BY_ID', name:postsId, data: commentList });

    resolve();

  });
  }
}

export function updateComment(filters) {
  return (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    
    let [ err, res ] = await graphql({
      type: 'mutation',
      apis: [{
        api: 'updateComment',
        args: JSON.parse(JSON.stringify(filters)),
        fields: `success`
      }],
      headers: { accessToken: getState().user.accessToken }
    });

    if (err) return resolve([err])

    let _id = filters._id;
    delete filters._id;

    if (filters.content_html) {
      filters.content_html = decodeURIComponent(filters.content_html);
    }

    dispatch({ type: 'UPDATE_COMMENT', id: _id, update: processCommentList([filters])[0] });

    resolve([null])

  })
  }
}
