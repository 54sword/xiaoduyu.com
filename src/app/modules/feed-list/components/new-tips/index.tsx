import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';

// redux
// import { bindActionCreators } from 'redux';
import { connect, useStore, useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { getFeedListById } from '@app/redux/reducers/feed';
import { refreshFeedListById } from '@app/redux/actions/feed';
// import { loadPostsList, refreshPostsListById } from '@actions/posts';
import { loadTips } from '@app/redux/actions/tips';
import { loadUserInfo } from '@app/redux/actions/user';
import { getTipsById } from '@app/redux/reducers/tips';

// style
import './styles/index.scss';

interface Props {
  topicId: string
}

export default function({ topicId }: Props) {

  const me = useSelector((state: object)=>getUserInfo(state));

  if (!me) {
    return null
  }

  const hasNew = useSelector((state: object)=>getTipsById(state, topicId));
  const _getFeedListById = useSelector((state: object)=>getFeedListById(state, topicId));

  const store = useStore();
  // const _loadPostsList = (args:object)=>loadPostsList(args)(store.dispatch, store.getState);
  const _refreshPostsListById = (args:string)=>refreshFeedListById(args)(store.dispatch, store.getState);
  const _loadTips = ()=>loadTips()(store.dispatch, store.getState);
  const _loadUserInfo = (args:object)=>loadUserInfo(args)(store.dispatch, store.getState);

  // loadPostsList: bindActionCreators(loadPostsList, dispatch),
  // refreshPostsListById: bindActionCreators(refreshPostsListById, dispatch),
  // loadTips: bindActionCreators(loadTips, dispatch),
  // loadUserInfo: bindActionCreators(loadUserInfo, dispatch)

  const componentDidMount = async function() {
    // const { me, topicId, getPostsListById, loadUserInfo, loadTips } = this.props;

    let date = me[`last_find_${topicId == 'favorite' ? 'subscribe' : topicId}_at`] || '';

    if (!date) return;

    let { data = null } = _getFeedListById || {};//getPostsListById(topicId);

    // if (!data || !data[0]) return;

    // 如果当前帖子的中数据比当前用户的记录要大，说明已经是最新的，更新用户的数据，以及tips状态
    if (
      !data
      // topicId == 'favorite' && !data
      // topicId == 'favorite' && data && new Date(date).getTime() < new Date(data[0].last_comment_at).getTime() ||
      // topicId == 'feed' && data && 
    ) {
      setTimeout(async ()=>{
        await _loadUserInfo({});
        _loadTips();
      }, 1000);
    }
  }

  const loadNewPosts = async function() {
    // const { topicId, refreshPostsListById, loadTips, loadUserInfo } = this.props;

    // if (topicId == 'favorite' || topicId == 'home') {
      await _refreshPostsListById(topicId);
      await _loadUserInfo({});
      _loadTips();
    // }
  }

  useEffect(()=>{
    componentDidMount();
  }, []);

  // let { data = null, filters } = _getFeedListById;

  // if (!data) return null;
  if (!hasNew) return null;
  return <a styleName="bar" href="javascript:void(0)" onClick={loadNewPosts}>有新的动态</a>
}
