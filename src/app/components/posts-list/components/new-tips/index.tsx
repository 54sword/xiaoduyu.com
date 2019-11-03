import React, { useEffect } from 'react';

// redux
import { useStore, useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { getPostsListById } from '@app/redux/reducers/posts';
import { refreshPostsListById } from '@app/redux/actions/posts';
import { loadTips } from '@app/redux/actions/tips';
import { loadUserInfo } from '@app/redux/actions/user';
import { getTipsById } from '@app/redux/reducers/tips';

// style
import './styles/index.scss';

interface Props {
  topicId: string
}

export default function({ topicId }: Props) {

  const me = useSelector((state: object)=>getUserInfo(state)),
        hasNew = useSelector((state: object)=>getTipsById(state, topicId)),
        _getPostsListById = useSelector((state: object)=>getPostsListById(state, topicId)),
        store = useStore(),
        _refreshPostsListById = (args:string)=>refreshPostsListById(args)(store.dispatch, store.getState),
        _loadTips = ()=>loadTips()(store.dispatch, store.getState),
        _loadUserInfo = (args:object)=>loadUserInfo(args)(store.dispatch, store.getState);

  // const me = useSelector((state: object)=>getUserInfo(state));
  // const hasNew = useSelector((state: object)=>getTipsById(state, topicId));
  // const _getPostsListById = useSelector((state: object)=>getPostsListById(state, topicId));
  // const store = useStore();
  // const _refreshPostsListById = (args:string)=>refreshPostsListById(args)(store.dispatch, store.getState);
  // const _loadTips = ()=>loadTips()(store.dispatch, store.getState);
  // const _loadUserInfo = (args:object)=>loadUserInfo(args)(store.dispatch, store.getState);

  const start = async function() {

    if (!me) return null;

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
      if (me) await _loadUserInfo({});
      _loadTips();


      $('body,html').animate({
        scrollTop: 0
      }, 500);

    }
  }

  const removeTips = function() {
    store.dispatch({
      type: 'SET_TIPS_BY_ID',
      id: topicId,
      status: false
    })
  }


  useEffect(()=>{
    start();

    if (hasNew) {
      const obj = FloatFixed({
        id: 'new-tips',
        offsetTop: 50
      });
  
      return ()=>{
        obj.remove();
      }
    }

  }, [hasNew]);

  if (!hasNew) return null;

  return (<div styleName="button">
    <div id="new-tips">
      <span styleName="tips" className="a" onClick={loadNewPosts}>有新的动态</span>
      <span styleName="close" className="a" onClick={removeTips}>×</span>
    </div>
  </div>)
}
