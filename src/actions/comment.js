import grapgQLClient from '../common/grapgql-client';

import Ajax from '../common/ajax';
import { DateDiff } from '../common/date';

import loadList from './common/new-load-list';
import graphql from './common/graphql';

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
          if (i == posts_id) {
            if (!newComment.parent_id) {
              commentState[i].data.push(newComment);
            } else {
              commentState[i].data.map(item=>{
                if (item._id == newComment.parent_id) {
                  item.reply.push(newComment);
                }
              })
            }

          }
        }

        dispatch({ type: 'SET_COMMENT', state: commentState });

      }

    });

  }
}



/*
export function updateComment({ id, contentJSON, contentHTML, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let state = getState().comment
    let posts = getState().posts

    return Ajax({
      url: '/update-comment',
      type: 'post',
      data: {
        id : id,
        content : contentJSON,
        content_html: contentHTML
      },
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        for (let i in state) {

          state[i].data.map(item=>{
            if (item._id == id) {
              item.content = contentJSON
              item.content_html = contentHTML
            }

            if (!item.reply) return

            item.reply.map(item=>{
              if (item._id == id) {
                item.content = contentJSON
                item.content_html = contentHTML
              }
            })

          })

        }

        for (let i in posts) {

          posts[i].data.map(item=>{

            if (!item.comment) return

            item.comment.map((comment, index)=>{
              if (comment._id == id) {
                item.comment[index].content_html = contentHTML

                let text = contentHTML.replace(/<[^>]+>/g,"")
                if (text.length > 200) text = text.slice(0, 200)+'...'

                item.comment[index].content_summary = text
              }
            })

          })

        }

        dispatch({ type: 'SET_POSTS', state:posts })
        dispatch({ type: 'SET_COMMENT', state })

        callback(res)

      }
    })

  }
}
*/
export const loadCommentById = ({ id, callback = () => {} }) => {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken

    let data = {
      comment_id: id,
      per_page: 1,
      draft: 1
    }

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    /*
    return loadCommentList({
      name:   id,
      filters: {
        comment_id: id,
        per_page: 1,
        draft: 1
      },
      callback: (res)=>{
        if (res.success && res.data && res.data.length > 0) {
          // dispatch({ type: 'ADD_COMMENT', comment: res.data[0] })
          callback(res.data[0])
        } else {
          callback(null)
        }
        // console.log(res);
      }
    })(dispatch, getState)
    */

    return Ajax({
      url: '/comments',
      params: data,
      headers,
      callback: (res) => {

        if (res.success && res.data && res.data.length > 0) {
          dispatch({ type: 'ADD_COMMENT', comment: res.data[0] })
          callback(res.data[0])
        } else {
          callback(null)
        }

      }
    })

  }
}

const processCommentList = (list) => {
  list.map(item=>{
    item._create_at = DateDiff(item.create_at);

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

export function loadCommentList({ name, filters = {}, restart = false }) {
  return (dispatch, getState) => {

    /*
    posts_id{
      _id
      title
      content_html
    }
     */

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
        posts_id
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
          weaken:
          device
          like_count
          create_at
          content_html
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
  return async (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    let variables = []

    for (let i in filters) {

      let v = ''

      switch (typeof filters[i]) {
        case 'string':
          v = '"'+filters[i]+'"'
          break
        case 'number':
          v = filters[i]
          break
        default:
          v = filters[i]
          break
      }

      variables.push(i+':'+v)
    }

    let sql = `
      mutation {
      	updateComment(${variables}){
          success
        }
      }
    `

    let [ err, res ] = await grapgQLClient({
      mutation:sql,
      headers: accessToken ? { 'AccessToken': accessToken } : null
    })

    if (err) return

    let _id = filters._id

    delete filters._id

    dispatch({ type: 'UPDATE_COMMENT', id: _id, update: filters })
    let list = getState().comment

    for (let i in list) {
      if (list[i].data) {
        list[i].data = processPostsList(list[i].data)
      }
    }

    dispatch({ type: 'UPDATE_COMMENT', state: list })
  }
}

/*
export function updateComment({ query = {}, update = {}, options = {} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/commment/update',
      type: 'post',
      data: { query, update, options },
      headers: { 'AccessToken': accessToken }
    }).then((result) => {

      if (result && result.success) {

        dispatch({ type: 'UPDATE_COMMENT', id: query._id, update })
        let commentList = getState().comment

        for (let i in commentList) {
          if (commentList[i].data) {
            commentList[i].data = processCommentList(commentList[i].data)
          }
        }

        dispatch({ type: 'SET_COMMENT', state: commentList })

      }

    })
  }
}
*/

/*
export function loadCommentList({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    let commentList = getState().comment[name] || {}


    if (typeof(commentList.more) != 'undefined' && !commentList.more ||
      commentList.loading
    ) {
      callback()
      return
    }

    if (!commentList.data) {
      commentList.data = []
    }

    if (!commentList.filters) {
      filters.gt_create_at = filters.gt_create_at || 0
      filters.per_page = filters.per_page || 30
      commentList.filters = filters
    } else {
      filters = commentList.filters
      if (commentList.data[commentList.data.length - 1]) {
        filters.gt_create_at = new Date(commentList.data[commentList.data.length - 1].create_at).getTime()
      }
    }

    if (!commentList.more) {
      commentList.more = true
    }

    if (!commentList.count) {
      commentList.count = 0
    }

    if (!commentList.loading) {
      commentList.loading = true
    }

    dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: commentList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    return Ajax({
      url: '/comments',
      data: filters,
      headers
    }).then(res => {

      if (!res || !res.success) {
        callback(res)
        return
      }

      let _commentList = res.data

      commentList.more = res.data.length < commentList.filters.per_page ? false : true
      commentList.data = commentList.data.concat(processCommentList(_commentList))
      commentList.filters = filters
      commentList.count = 0
      commentList.loading = false

      dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: commentList })
      callback(res)

    })

  };
}
*/
