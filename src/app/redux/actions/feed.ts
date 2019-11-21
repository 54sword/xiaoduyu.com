import { dateDiff } from '../../common/date';
import Utils from '../utils/html';
import Device from '../../common/device';

import loadList from '../utils/new-graphql-load-list';

// 加工问题列表
const processPostsList = (list: Array<any>) => {

  list.map(function(item){

    if (item.posts_id) {

      let posts = item.posts_id;

      // item.posts_id.user_id = item.user_id;
      
      if (posts.device) {
        posts._device = Device.getNameByDeviceId(posts.device);
      }

      if (posts.content_html) {
        
        // 提取内容中所有的图片地址
        // posts.images = abstractImages(posts.content_html);
        posts.images = Utils.abstractImagesFromHTML(posts.content_html);

        if (posts.images && posts.images.length > 0) {
          posts.coverImage = posts.images[0].split('?')[0]+'?imageView2/2/w/300/auto-orient/format/jpg'
        }

        let textContent = Utils.htmlToString(posts.content_html);

        if (textContent.length > 70) textContent = textContent.slice(0, 70)+'...';
        posts.content_summary = textContent;

        // 获取内容中所有的图片
        posts.content_html = Utils.htmlImageOptimization(posts.content_html);
      }

      if (posts.create_at) posts._create_at = dateDiff(posts.create_at);
      if (posts.sort_by_date) posts._sort_by_date = dateDiff(posts.sort_by_date);
      if (posts.last_comment_at) posts._last_comment_at = dateDiff(posts.last_comment_at);

      item.posts_id = posts;

    }

    if (item.comment_id) {

      item.comment_id.user_id = item.user_id;

      item.comment_id.images = Utils.abstractImagesFromHTML(item.comment_id.content_html);

      // if (posts.images && posts.images.length > 0) {
        // posts.coverImage = posts.images[0].split('?')[0]+'?imageView2/2/w/300/auto-orient/format/jpg'
      // }

      let textContent = Utils.htmlImgToText(item.comment_id.content_html);

      textContent = Utils.htmlToString(textContent);

      if (textContent.length > 70) textContent = textContent.slice(0, 70)+'...';
      item.comment_id.content_summary = textContent;

      if (item.comment_id.create_at) item.comment_id._create_at = dateDiff(item.comment_id.create_at);

      if (item.comment_id.reply_id) {

        let textContent = Utils.htmlToString(item.comment_id.reply_id.content_html);

        if (textContent.length > 70) textContent = textContent.slice(0, 70)+'...';
        item.comment_id.reply_id.content_summary = textContent;

        item.comment_id.reply_id.images = Utils.abstractImagesFromHTML(item.comment_id.reply_id.content_html);

        if (item.comment_id.reply_id.create_at) item.comment_id.reply_id._create_at = dateDiff(item.comment_id.reply_id.create_at);
      }

      if (item.comment_id.posts_id) {

        let posts = item.comment_id.posts_id;

        let textContent = Utils.htmlToString(posts.content_html);

        if (textContent.length > 70) textContent = textContent.slice(0, 70)+'...';
        posts.content_summary = textContent;

        if (posts.create_at) posts._create_at = dateDiff(posts.create_at);


        posts.images = Utils.abstractImagesFromHTML(posts.content_html);

        item.comment_id.posts_id = posts;
      }

    }

  });

  return list

}

export const loadFeedList = loadList({
  reducerName: 'feed',
  actionType: 'SET_FEED_LIST_BY_ID',
  processList: processPostsList,
  api: 'feed',
  fields: `
    _id
    create_at
    user_id{
      _id
      nickname
      brief
      avatar_url
    }
    posts_id{
      _id
      comment_count
      reply_count
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
    }
    comment_id{
      _id
      parent_id
      like
      like_count
      reply_count
      create_at
      content_html
      parent_id
      reply_id{
        _id
        content_html
        create_at
        user_id{
          _id
          nickname
          brief
          avatar
          avatar_url
        }
      }
    }
  `
});

// 刷新帖子列表
export const refreshFeedListById = (id: string) => {
  return (dispatch: any, getState: any) => {

    let list = getState().feed[id] || null;

    if (!list || !list.filters) return;

    delete list.filters.page_size;
    delete list.filters.page_number;

    return loadFeedList({
      id,
      args: list.filters,
      restart: true
    })(dispatch, getState);

  }
}