import { reactLocalStorage } from 'reactjs-localstorage';
import { DateDiff } from '../common/date';
import loadList from '../common/graphql-load-list';
import graphql from '../common/graphql';

// 添加问题
export function addPosts({ title, detail, detailHTML, topicId, device, type, callback = ()=>{} }) {
  return (dispatch, getState) => {

    return new Promise(async resolve => {

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

    })

  }
}


export function loadPostsList({ id, filters, restart = false }) {
  return async (dispatch, getState) => {

    if (id == 'follow') {
      // 移除提醒
      dispatch({ type: 'ADD_NEW_POSTS_TIPS', newPostsTips: {} });
    }

    if (!filters.select) {

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

    if (oldImgDom) {

      let _img = oldImgDom.match(srcReg);

      if (_img && _img[1]) {
        let newImg = oldImgDom.replace(_img[1], _img[1]+'?imageView2/2/w/800/auto-orient/format/jpg');
        str = str.replace(oldImgDom, newImg);
      }

    }

  }

  return str

}


// 加工问题列表
const processPostsList = (list) => {

  list.map(function(posts){

    if (posts.content_html) {

      // 提取内容中所有的图片地址
      posts.images = abstractImages(posts.content_html);

      if (posts.images && posts.images.length > 0) {
        posts.coverImage = posts.images[0].split('?')[0]+'?imageView2/2/w/300/auto-orient/format/jpg'
      }

      // 将内容生产140的简介
      let textContent = posts.content_html;

      // let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
      let imgReg = /<img(.*?)>/gi;

      let imgs = [];
      let img;
      while (img = imgReg.exec(textContent)) {
        imgs.push(img[0]);
      }

      imgs.map(item=>{
        textContent = textContent.replace(item, '[图片] ');
      });

      // 删除所有html标签
      textContent = textContent.replace(/<[^>]+>/g,"");

      if (textContent.length > 140) textContent = textContent.slice(0, 140)+'...';
      posts.content_summary = textContent;

      // 获取内容中所有的图片
      posts.content_html = imageOptimization(posts.content_html);
    }

    if (posts.create_at) posts._create_at = DateDiff(posts.create_at);
    if (posts.sort_by_date) posts._sort_by_date = DateDiff(posts.sort_by_date);
    if (posts.last_comment_at) posts._last_comment_at = DateDiff(posts.last_comment_at);

  });

  return list

}


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
