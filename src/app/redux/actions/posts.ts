import storage from '../../common/storage';

import { dateDiff } from '../../common/date';
import Device from '../../common/device';
import graphql from '../../common/graphql';
import To from '../../common/to';

import loadList from '../utils/new-graphql-load-list';


// 加工问题列表
const processPostsList = (list: Array<any>, store?: any, id?: string) => {

  list.map(function(posts){

    if (posts.device) {
      posts._device = Device.getNameByDeviceId(posts.device);
    }

    if (posts.content_html && posts.content_html == '<p><br></p>') {
      posts.content_html = '';
    }

    if (posts.content_html) {
      
      // posts.content_html = decodeURIComponent(posts.content_html);

      // 提取内容中所有的图片地址
      posts.images = abstractImages(posts.content_html);

      if (posts.images && posts.images.length > 0) {
        posts._coverImage = posts.images[0].split('?')[0]+'?imageView2/2/w/300/auto-orient/format/jpg'
      }

      // 将内容生产140的简介
      let textContent = posts.content_html;

      // console.log(textContent);

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

      // let preReg = /<pre>(.*?)<\/pre>/gi;

      // let pres = [];
      // let pre;
      // while (pre = preReg.exec(textContent)) {
      //   pres.push(pre[0]);
      // }

      // pres.map(item=>{
      //   textContent = textContent.replace(item, '[代码] ');
      // });

      // 删除所有html标签
      textContent = textContent.replace(/<[^>]+>/g, '');
      textContent = textContent.replace(/\r\n/g, ''); 
      textContent = textContent.replace(/\n/g, '');

      if (textContent.length > 137) textContent = textContent.slice(0, 137)+'...';      

      posts.content_summary = textContent;



      // 获取内容中所有的图片
      posts.content_html = imageOptimization(posts.content_html);
    }

    if (posts.create_at) posts._create_at = dateDiff(posts.create_at);
    if (posts.sort_by_date) posts._sort_by_date = dateDiff(posts.sort_by_date);
    if (posts.last_comment_at) posts._last_comment_at = dateDiff(posts.last_comment_at);
    if (posts.update_at) posts._update_at = dateDiff(posts.update_at);
  });

  return list

}

interface AddPosts {
  title: string,
  detail: string,
  detailHTML: string,
  topicId: string,
  device: number,
  type: number
}

// 添加问题
export function addPosts({ title, detail, detailHTML, topicId, device, type }: AddPosts) {
  return (dispatch: any, getState: any) => {
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

export const loadPostsList = loadList({
  reducerName: 'posts',
  actionType: 'SET_POSTS_LIST_BY_ID',
  processList: processPostsList,
  api: 'posts',
  fields: `
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
    parent_id {
      _id
      name
    }
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
    follow_people_count
    follow
  }
  verify
  view_count
  weaken
  follow
  like
  update_at
  `
});

// comment{
//   user_id{
//     avatar_url
//   }
// }

// 移除list
export const removePostsListById = (id: string) => {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'REMOVE_POSTS_LIST_BY_ID', id });
  }
}

// 刷新帖子列表
export const refreshPostsListById = (id: string) => {
  return (dispatch: any, getState: any) => {

    let list = getState().posts[id] || null;

    if (!list || !list.filters) return;

    delete list.filters.page_size;
    delete list.filters.page_number;
    
    return loadPostsList({
      id,
      args: list.filters,
      restart: true
    })(dispatch, getState).then(([err, res]: any)=>{

      // 如果是刷新帖子列表，可能评论/回复数等发生了变化，需要将这部分数据与其他帖子数据同步一下
      if (res && res.data && res.data.length > 0) {
        let postList:any = {};
        
        res.data.map((item: any)=>{
          postList[item._id] = item;
        });

        let postsState = getState().posts;

        Reflect.ownKeys(postsState).map(item=>{
          getState().posts[item].data.map((item: any)=>{
            if (postList[item._id]) {
              if (postList[item._id].comment_count) item.comment_count = postList[item._id].comment_count;
              if (postList[item._id].reply_count) item.reply_count = postList[item._id].reply_count;
              if (postList[item._id].follow_count) item.follow_count = postList[item._id].follow_count;
              if (postList[item._id].like_count) item.like_count = postList[item._id].like_count;
            }
          })
        });

        dispatch({ type: 'SET_POSTS', state: postsState });
      } 


    })

  }
}

export function viewPostsById({ id }: { id: string}) {
  return async (dispatch: any, getState: any) => {

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


interface UpdatePosts {
  id: string
  title: string
  detail: string
  detailHTML: string
  topicId: string
  topicName: string
}

export function updatePosts({ id, title, detail, detailHTML, topicId, topicName }: UpdatePosts) {
  return async (dispatch: any, getState: any) => {
  return new Promise(async (resolve, reject) => {

    let args: any = {
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

    loadPostsList({
      id,
      args: {
        _id: id
      },
      restart: true
    })(dispatch, getState)
    .then(([err, res]: any)=>{

      let posts = res && res.data && res.data[0] ? res.data[0] : null;

      if (!posts) {
        resolve(res)
      } else {
        dispatch({ type: 'UPDATE_POST', id: id, update: posts });
      }

      resolve(res)
    })

    // args.topic_id = {
    //   _id: topicId,
    //   name: topicName
    // }

    /*
    if (args.content_html) {
      args.content_html = decodeURIComponent(args.content_html);
    }

    dispatch({ type: 'UPDATE_POST', id: id, update: args });
    let postsList = getState().posts;

    for (let i in postsList) {
      if (postsList[i].data) {
        postsList[i].data = processPostsList(postsList[i].data)
      }
    }


    dispatch({ type: 'UPDATE_POST', state: postsList })
    */

    

  })
  }
}

const abstractImages = (str: string) => {

  let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  let result = [];
  let img;
  while (img = imgReg.exec(str)) {
    let _img: any = img[0].match(srcReg)
    if (_img && _img[1]) {

      _img = _img[1];

      if (_img[1].indexOf('xiaoduyu.com') != -1) {
        _img = _img[1] + '?imageView2/2/w/800/auto-orient/format/jpg'
      }
      
      result.push(_img)
    }
  }

  return result

}


// 图像优化，给html中的img图片，增加一些七牛参数，优化最大宽度，格式等
const imageOptimization = (str: string) => {

  let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  let result = [];
  let img;
  while (img = imgReg.exec(str)) {
    let oldImgDom = img[0];

    if (oldImgDom) {

      let _img = oldImgDom.match(srcReg);

      if (_img && _img[1] && _img[1].indexOf('xiaoduyu.com') != -1) {
        let newImg = oldImgDom.replace(_img[1], _img[1]+'?imageView2/2/w/800/auto-orient/format/jpg');
        str = str.replace(oldImgDom, newImg);
      }

    }

  }

  return str

}


