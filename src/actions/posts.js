import grapgQLClient from '../common/grapgql-client'

import { reactLocalStorage } from 'reactjs-localstorage'

// import merge from 'lodash/merge'
import Ajax from '../common/ajax'
// import Promise from 'promise'

import { DateDiff } from '../common/date'
// import loadList from './common/load-list'
import loadList from './common/new-load-list'

import graphql from './common/graphql';

// console.log(loadList);

// 添加问题
export function addPosts({ title, detail, detailHTML, topicId, device, type, callback = ()=>{} }) {
  return (dispatch, getState) => {

    return new Promise(async resolve => {

      // detail, detail_html: detailHTML,
      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addPosts',
        args: { title, content: detail, content_html: detailHTML, topic_id: topicId, device_id: device, type },
        fields: `
          success
          _id
        `,
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([ err, res ]);

      // if (err) return resolve([ err ? err.message : '未知错误' ]);

      // dispatch({ type: 'UPDATE_POSTS_FOLLOW', id, followStatus: status  });

    })

    /*
    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/add-posts',
      type:'post',
      data: {
        title: title, detail: detail, detail_html: detailHTML,
        topic_id: topicId, device_id: device, type: type
      },
      headers: { AccessToken: accessToken },
      callback
    })
    */

  }
}

/*
export function updatePostsById({ id, typeId, topicId, title, content, contentHTML, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let state = getState().posts

    return Ajax({
      url: '/update-posts',
      type:'post',
      data: {
        id: id, type: typeId, title: title,
        topic_id: topicId, content: content, content_html: contentHTML
      },
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (!res || !res.success) {
          callback(res)
          return
        }

        loadPostsById({
          id,
          callback: (posts)=> {

            if (!posts) {
              return callback(null)
            }

            for (let i in state) {
              let data = state[i].data
              if (data.length > 0) {
                for (let n = 0, max = data.length; n < max; n++) {
                  if (data[n]._id == id) {
                    state[i].data[n] = posts
                  }
                }
              }
            }

            dispatch({ type: 'SET_POSTS', state })
            callback(res)

          }
        })(dispatch, getState)

      }
    })

  }
}

*/

export function loadPostsList({ id, filters, restart = false }) {
  return async (dispatch, getState) => {

    if (id == 'follow') {
      // 移除提醒
      dispatch({ type: 'ADD_NEW_POSTS_TIPS', newPostsTips: {} });
    }

    if (!filters.select) {

      /*
      comment{
        _id
        user_id{
          _id
          nickname
          brief
          avatar_url
        }
        content_html
        create_at
      }
       */

      // content
      filters.select = `
        _id
        comment_count
        content_html
        create_at
        deleted
        device
        follow_count
        ip
        last_comment_at
        like_count
        recommend
        sort_by_date
        title
        topic_id{
          _id
          name
        }
        type
        user_id{
          _id
          nickname
          brief
          avatar_url
        }
        verify
        view_count
        weaken
        follow
        like
      `
    }

    return loadList({
      dispatch,
      getState,

      name: id,
      restart,
      filters,

      processList: processPostsList,

      schemaName: 'posts',
      reducerName: 'posts',
      api: '/posts',
      actionType: 'SET_POSTS_LIST_BY_NAME'
    })
  }
}

/*
Ajax({
  apiVerstion: '',
  url: '/graphql',
  type: 'post',
  data: {
    query: `
      {
        posts(limit:10) {
          _id
          title
        }
      }
    `,
    variables: null,
    operationName: null
  }
}).then(res=>{
  console.log(res);
})
*/

/*
export function loadPostsById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {



    return loadPostsList({
      name: id,
      filters: { posts_id: id, per_page: 1, draft: 1 },
      restart: true,
      callback: (result)=>{
        if (!result || !result.success || !result.data || result.data.length == 0) {
          return callback(null)
        }
        callback(result.data[0])
      }
    })(dispatch, getState)
  }
}
*/

export function viewPostsById({ id, callback = ()=>{ } }) {
  return async (dispatch, getState) => {

    // 浏览次数累计
    let viewPosts = reactLocalStorage.get('view-posts') || '';
    let lastViewPostsAt = reactLocalStorage.get('last-viewed-posts-at') || new Date().getTime();

    // 如果超过1小时，那么浏览数据清零
    if (new Date().getTime() - lastViewPostsAt > 3600000) viewPosts = '';

    viewPosts = viewPosts.split(',');

    if (!viewPosts[0]) viewPosts = [];

    if (viewPosts.indexOf(id) == -1) {
      viewPosts.push(id);
      reactLocalStorage.set('view-posts', viewPosts.join(','));
      reactLocalStorage.set('last-viewed-posts-at', new Date().getTime());

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'viewPosts',
        args: { posts_id: id },
        fields: `success`
      });

      if (res && res.success) {
        dispatch({ type: 'UPDATE_POSTS_VIEW', id: id })
      }

    }

    /*
    return Ajax({
      url: '/view-posts',
      params: { posts_id: id },
      callback: (result) => {
        if (result && result.success) {
          dispatch({ type: 'UPDATE_POSTS_VIEW', id: id })
        }
        callback(result)
      }
    })
    */
  }
}


export function updatePosts({ id, title, detail, detailHTML, topicId, topicName, device, type }) {
  return async (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {

    let args = {
      _id: id, title, content: detail, content_html: detailHTML, topic_id: topicId
    }

    let [ err, res ] = await graphql({
      type: 'mutation',
      api: 'updatePosts',
      args: JSON.parse(JSON.stringify(args)),
      fields: `
        success
      `,
      headers: { accessToken: getState().user.accessToken }
    });

    if (err) {
      return reject(err)
    }

    args.topic_id = {
      _id: topicId,
      name: topicName
    }

    dispatch({ type: 'UPDATE_POST', id: id, update: args });
    let postsList = getState().posts;

    for (let i in postsList) {
      if (postsList[i].data) {
        postsList[i].data = processPostsList(postsList[i].data)
      }
    }

    dispatch({ type: 'UPDATE_POST', state: postsList })

    resolve(res)

  })
  }
}

/*
export function updataDelete({ id, status }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url: '/posts/update-delete',
      type: 'post',
      data: { id, status, access_token: accessToken },
    }).then((result) => {
      dispatch({ type: 'UPDATE_POST_DELETE', id: id, status: status ? true : false })
    })
  }
}

export function updataWeaken({ id, status }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url: '/posts/update-weaken',
      type: 'post',
      data: { id, status, access_token: accessToken },
    }).then((result) => {
      dispatch({ type: 'UPDATE_POST_WEAKEN', id: id, status: status ? true : false })
    })
  }
}
*/


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


// 图像优化，给html中的img图片，增加一些七牛参数，优化最大宽度，格式等
const imageOptimization = (str) => {

  let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  let result = [];
  let img;
  while (img = imgReg.exec(str)) {
    let oldImgDom = img[0];
    let _img = oldImgDom.match(srcReg);
    let newImg = oldImgDom.replace(_img[1], _img[1]+'?imageView2/2/w/800/auto-orient/format/jpg');
    str = str.replace(oldImgDom, newImg);
  }

  return str

}


// 加工问题列表
const processPostsList = (list) => {

  list.map(function(posts){

    if (posts.content_html) {

      // 提取内容中所有的图片地址
      posts.images = abstractImages(posts.content_html);

      // 将内容生产140的简介
      let textContent = posts.content_html;

      let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;

      let img;
      while (img = imgReg.exec(textContent)) {
        textContent = textContent.replace(img, '[图片]');
      }

      textContent = textContent.replace(/<[^>]+>/g,"");

      // console.log(textContent.replace(var reg = /^http(s)?:\/\/(.*?)\//, ToReplace));



      if (textContent.length > 140) textContent = textContent.slice(0, 140)+'...';
      posts.content_summary = textContent;

      posts.content_html = imageOptimization(posts.content_html);

      // posts.content_html = linkOptimization(posts.content_html);
    }

    if (posts.create_at) posts._create_at = DateDiff(posts.create_at);
    if (posts.sort_by_date) posts._sort_by_date = DateDiff(posts.sort_by_date);
    if (posts.last_comment_at) posts._last_comment_at = DateDiff(posts.last_comment_at);

    /*
    if (posts.comment) {
      posts.comment.map(function(comment){

        comment.images = abstractImages(comment.content_html)

        comment._create_at = DateDiff(comment.create_at)

        let text = comment.content_html.replace(/(<img.*?)>/gi,"[图片]")

        text = text.replace(/<[^>]+>/g,"")
        if (text.length > 140) text = text.slice(0, 140)+'...'
        comment.content_summary = text

      })
    }
    */

  })

  return list

}

// 首页拉取新的帖子的时间
// let lastFetchAt = null;

// 获取新的主题，插入到 follow posts list
export function loadNewPosts(timestamp) {
  return async (dispatch, getState) => {

    let profile =  getState().user.profile;
    let postsList = getState().posts['follow'] || {};
    let lastPosts = postsList.data ? postsList.data[0] : null;

    if (!lastPosts) return;

    let [ err, res ] = await loadPostsList({
      id:'new-posts',
      filters:{
        variables: {
          method: 'user_follow',
          start_create_at: new Date(new Date(lastPosts.create_at).getTime() + 1000)+'',
          sort_by: 'create_at'
        }
      },
      restart: true
    })(dispatch, getState);

    if (res && res.data && res.data.length > 0) {

      // 填写新帖子到顶部
      let i = res.data.length;
      while (i--) {
        postsList.data.unshift(res.data[i]);
      }
      dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name: 'follow', data: postsList });

      // 更新最近获取follow帖子的时间
      profile.last_find_posts_at = postsList.data[0].create_at;
      dispatch({ type: 'SET_USER', userinfo: profile });
    }

  }

}


/*
// 显示新的帖子
export function showNewPosts() {
  return (dispatch, getState) => {

    let homeList = getState().posts['home']
    let newList = getState().posts['new']

    let i = newList.data.length
    while (i--) {
      homeList.data.unshift(newList.data[i])
    }

    lastFetchAt = newList.data[0].create_at

    window.scrollTo(0, 0)
    dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name:'home', data: homeList })

    setTimeout(()=>{
      dispatch({ type: 'SET_POSTS_LIST_BY_NAME', name:'new', data: { data: [] } })
    }, 100)

  }
}
*/


// 新主题通知
export const newPostsTips = () => {
  return async (dispatch, getState) => {

    let newPostsTips = getState().website.newPostsTips;

    let [ err, res ] = await loadPostsList({
      id: 'tips_follow',
      filters: {
        variables: {
          method: 'user_follow',
          sort_by: "create_at",
          deleted: false,
          weaken: false,
          page_size:1
        },
        select: `create_at`
      },
      restart: true
    })(dispatch, getState);

    if (res && res.data && res.data.length > 0) {
      newPostsTips['/follow'] = res.data[0].create_at;
    }

    dispatch({ type: 'ADD_NEW_POSTS_TIPS', newPostsTips });

  }
}

// 移除提醒
// export const removeNewPostsTips = () => {
//   return async (dispatch, getState) => {
//     dispatch({ type: 'ADD_NEW_POSTS_TIPS', newPostsTips: {} });
//   }
// }
