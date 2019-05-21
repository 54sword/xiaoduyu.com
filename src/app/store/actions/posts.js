
import storage from '../../common/storage';
import { DateDiff } from '../../common/date';
import loadList from '../../common/graphql-load-list';
import Device from '../../common/device';
import graphql from '../../common/graphql';
import To from '../../common/to';

// 添加问题
export function addPosts({ title, detail, detailHTML, topicId, device, type, callback = ()=>{} }) {
  return (dispatch, getState) => {

    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'addPosts',
          args: { title, content: detail, content_html: detailHTML, topic_id: topicId, device_id: device, type },
          fields: `
          success
          _id
          `
        }],
        headers: { accessToken: getState().user.accessToken }
      });

      resolve([ err, res ]);

    })

  }
}

export function loadPostsList({ id, filters, restart = false }) {
  return async (dispatch, getState) => {

    if (!filters.select) {

      // content
      filters.select = `
        _id
        comment_count
        reply_count
        content_html
        create_at
        deleted
        device
        follow_count
        last_comment_at
        like_count
        recommend
        sort_by_date
        title
        ip
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
          posts_count
          comment_count
          fans_count
          follow
        }
        verify
        view_count
        weaken
        follow
        like
        comment{
          user_id{
            avatar_url
          }
        }
        update_at
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
      api: 'posts',
      // cache: accessToken ? false : true,
      actionType: 'SET_POSTS_LIST_BY_ID'
    })
  }
}

// 移除list
export const removePostsListById = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: 'REMOVE_POSTS_LIST_BY_ID', id });
  }
}

// 刷新帖子列表
export const refreshPostsListById = (id) => {
  return (dispatch, getState) => {

    let list = getState().posts[id] || null;

    if (!list || !list.filters) return;

    delete list.filters.page_size;
    delete list.filters.page_number;

    return loadPostsList({
      id,
      filters:{
        variables: list.filters
      },
      restart: true
    })(dispatch, getState);

  }
}

export function viewPostsById({ id }) {
  return async (dispatch, getState) => {

    let [ err, res ] = await To(storage.load({ key: 'view-posts' }));
    
    let viewPosts = res || '';
    
    viewPosts = viewPosts.split(',');

    if (!viewPosts[0]) viewPosts = [];

    if (viewPosts.indexOf(id) == -1) {

      viewPosts.push(id);
      
      storage.save({
        key: 'view-posts',
        data: viewPosts.join(','),
        expires: 1000 * 3600,
      });

      let [ err, res ] = await graphql({
        type: 'mutation',
        apis: [{
          api: 'viewPosts',
          args: { posts_id: id },
          fields: `success`
        }]
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
      apis: [{
        api: 'updatePosts',
        args: JSON.parse(JSON.stringify(args)),
        fields: `success`
      }],
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

    if (posts.device) {
      posts._device = Device.getNameByDeviceId(posts.device);
    }

    if (posts.content_html) {

      // 提取内容中所有的图片地址
      posts.images = abstractImages(posts.content_html);

      if (posts.images && posts.images.length > 0) {
        posts._coverImage = posts.images[0].split('?')[0]+'?imageView2/2/w/300/auto-orient/format/jpg'
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


      if (textContent.length > 60) textContent = textContent.slice(0, 60)+'...';
      posts.content_summary = textContent;

      // 获取内容中所有的图片
      posts.content_html = imageOptimization(posts.content_html);
    }

    if (posts.create_at) posts._create_at = DateDiff(posts.create_at);
    if (posts.sort_by_date) posts._sort_by_date = DateDiff(posts.sort_by_date);
    if (posts.last_comment_at) posts._last_comment_at = DateDiff(posts.last_comment_at);
    if (posts.update_at) posts._update_at = DateDiff(posts.update_at);
  });

  return list

}