import { reactLocalStorage } from 'reactjs-localstorage';
import { DateDiff } from '../../common/date';
import loadList from '../../common/graphql-load-list';
// import graphql from '../../common/graphql';
// import graphqlClient from '../../common/graphql-new';
// import To from '../../common/to';
import Utils from '@utils/utils';
import Device from '@utils/device';

export function loadFeedList({ id, filters, restart = false }) {
  return async (dispatch, getState) => {

    let accessToken = accessToken || getState().user.accessToken;

    if (id == 'follow') {
      // 移除提醒
      dispatch({ type: 'HAS_NEW_FEED', status: false });
    }

    if (!filters.select) {

      // content
      filters.select = `
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
    }

    return loadList({
      dispatch,
      getState,

      name: id,
      restart,
      filters,

      processList: processPostsList,

      schemaName: 'feed',
      reducerName: 'feed',
      api: 'feed',
      actionType: 'SET_FEED_LIST_BY_NAME'
    })
  }
}

// 加工问题列表
const processPostsList = (list) => {

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

        if (textContent.length > 140) textContent = textContent.slice(0, 140)+'...';
        posts.content_summary = textContent;

        // 获取内容中所有的图片
        posts.content_html = Utils.htmlImageOptimization(posts.content_html);
      }

      if (posts.create_at) posts._create_at = DateDiff(posts.create_at);
      if (posts.sort_by_date) posts._sort_by_date = DateDiff(posts.sort_by_date);
      if (posts.last_comment_at) posts._last_comment_at = DateDiff(posts.last_comment_at);

      item.posts_id = posts;

    }

    if (item.comment_id) {

      item.comment_id.user_id = item.user_id;

      item.comment_id.images = Utils.abstractImagesFromHTML(item.comment_id.content_html);

      // if (posts.images && posts.images.length > 0) {
        // posts.coverImage = posts.images[0].split('?')[0]+'?imageView2/2/w/300/auto-orient/format/jpg'
      // }

      let textContent = Utils.htmlImgToText(item.comment_id.content_html);

      // if (textContent.length > 140) textContent = textContent.slice(0, 140)+'...';
      item.comment_id.content_summary = textContent;

      if (item.comment_id.create_at) item.comment_id._create_at = DateDiff(item.comment_id.create_at);

      if (item.comment_id.reply_id) {

        let textContent = Utils.htmlToString(item.comment_id.reply_id.content_html);

        if (textContent.length > 70) textContent = textContent.slice(0, 70)+'...';
        item.comment_id.reply_id.content_summary = textContent;

        item.comment_id.reply_id.images = Utils.abstractImagesFromHTML(item.comment_id.reply_id.content_html);

        if (item.comment_id.reply_id.create_at) item.comment_id.reply_id._create_at = DateDiff(item.comment_id.reply_id.create_at);
      }

      if (item.comment_id.posts_id) {

        let posts = item.comment_id.posts_id;

        let textContent = Utils.htmlToString(posts.content_html);

        if (textContent.length > 70) textContent = textContent.slice(0, 70)+'...';
        posts.content_summary = textContent;

        if (posts.create_at) posts._create_at = DateDiff(posts.create_at);


        posts.images = Utils.abstractImagesFromHTML(posts.content_html);

        item.comment_id.posts_id = posts;
      }

    }

  });

  return list

}


// 获取新的主题，插入到 follow posts list
export function loadNewFeed(timestamp) {
  return async (dispatch, getState) => {

    let profile =  getState().user.profile;
    let list = getState().feed['follow'] || {};
    let lastFeed = list.data ? list.data[0] : null;

    if (!lastFeed) return;

    let [ err, res ] = await loadFeedList({
      id:'new-feed',
      filters:{
        variables: {
          start_create_at: new Date(new Date(lastFeed.create_at).getTime() + 1000)+'',
          sort_by: "create_at:-1",
        }
      },
      restart: true
    })(dispatch, getState);

    if (res && res.data && res.data.length > 0) {

      // 填写新帖子到顶部
      let i = res.data.length;
      while (i--) {
        list.data.unshift(res.data[i]);
      }
      dispatch({ type: 'SET_FEED_LIST_BY_NAME', name: 'follow', data: list });

      if (new Date(list.data[0].create_at).getTime() < new Date(profile.last_find_feed_at).getTime()) {
        dispatch({ type: 'HAS_NEW_FEED', status: true });
      } else {
        dispatch({ type: 'HAS_NEW_FEED', status: false });
      }

      // 更新最近获取follow帖子的时间
      profile.last_find_posts_at = list.data[0].create_at;
      dispatch({ type: 'SET_USER', userinfo: profile });

    }

  }

}


// 获取最新一条feed，然后根据创建日期，判断是否有新的feed
export const updateNewstFeedCreateDate = () => {
  return async (dispatch, getState) => {

    let profile =  getState().user.profile;

    let [ err, res ] = await loadFeedList({
      id: 'newest-feed-create-at',
      filters: {
        variables: {
          sort_by: "create_at:-1",
          page_size:1
        },
        select: `create_at`
      },
      restart: true
    })(dispatch, getState);

    if (res && res.data && res.data.length > 0) {

      let feed = res.data[0];

      if (new Date(feed.create_at).getTime() > new Date(profile.last_find_feed_at).getTime()) {
        dispatch({ type: 'HAS_NEW_FEED', status: true });
      }

    } else {
      dispatch({ type: 'HAS_NEW_FEED', status: false });
    }

  }
}


// 刷新帖子列表
export const refreshFeedListById = (id) => {
  return (dispatch, getState) => {

    let list = getState().feed[id] || null;

    if (!list || !list.filters) return;

    delete list.filters.page_size;
    delete list.filters.page_number;

    return loadFeedList({
      id,
      filters:{
        variables: list.filters
      },
      restart: true
    })(dispatch, getState);

  }
}