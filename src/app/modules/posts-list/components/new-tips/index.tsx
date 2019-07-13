import React, { useEffect } from 'react';

// redux
import { useStore, useSelector } from 'react-redux';
import { getUserInfo } from '@reducers/user';
import { getPostsListById } from '@reducers/posts';
import { refreshPostsListById } from '@actions/posts';
import { loadTips } from '@actions/tips';
import { loadUserInfo } from '@actions/user';
import { getTipsById } from '@reducers/tips';

// style
import './index.scss';

interface Props {
  topicId: string
}

export default function({ topicId }: Props) {

  const me = useSelector((state: object)=>getUserInfo(state));

  if (!me) {
    return null
  }

  const hasNew = useSelector((state: object)=>getTipsById(state, topicId));
  const _getPostsListById = useSelector((state: object)=>getPostsListById(state, topicId));

  const store = useStore();
  const _refreshPostsListById = (args:string)=>refreshPostsListById(args)(store.dispatch, store.getState);
  const _loadTips = ()=>loadTips()(store.dispatch, store.getState);
  const _loadUserInfo = (args:object)=>loadUserInfo(args)(store.dispatch, store.getState);

  const componentDidMount = async function() {

    let date = me[`last_find_${topicId == 'favorite' ? 'subscribe' : topicId}_at`] || '';

    if (!date) return;

    let { data = null } = _getPostsListById || {};


    // 如果当前帖子的中数据比当前用户的记录要大，说明已经是最新的，更新用户的数据，以及tips状态
    if (
      !data
    ) {
      setTimeout(async ()=>{
        await _loadUserInfo({});
        _loadTips();
      }, 1000);
    }
  }

  const loadNewPosts = async function() {
    if (topicId == 'favorite' || topicId == 'home') {
      await _refreshPostsListById(topicId);
      await _loadUserInfo({});
      _loadTips();
    }
  }

  useEffect(()=>{
    componentDidMount();
  }, []);

  if (!hasNew) return null;
  return <a styleName="bar" href="javascript:void(0)" onClick={loadNewPosts}>有新的动态</a>
}
