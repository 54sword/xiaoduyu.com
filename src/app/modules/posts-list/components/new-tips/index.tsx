import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';

// redux
// import { bindActionCreators } from 'redux';
import { connect, useStore, useSelector } from 'react-redux';
import { isMember, getProfile } from '@reducers/user';
import { getPostsListById } from '@reducers/posts';
import { loadPostsList, refreshPostsListById } from '@actions/posts';
import { loadTips } from '@actions/tips';
import { loadUserInfo } from '@actions/user';
import { getTipsById } from '@reducers/tips';

// style
import './index.scss';

interface Props {
  topicId: string
}

export default function({ topicId }: Props) {

  const me = useSelector((state: object)=>getProfile(state));

  if (!me) {
    return null
  }

  // const isMember = useSelector((state: object)=>isMember(state));
  const hasNew = useSelector((state: object)=>getTipsById(state, topicId));
  const _getPostsListById = useSelector((state: object)=>getPostsListById(state, topicId));

  const store = useStore();
  // const _loadPostsList = (args:object)=>loadPostsList(args)(store.dispatch, store.getState);
  const _refreshPostsListById = (args:string)=>refreshPostsListById(args)(store.dispatch, store.getState);
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

    let { data = null } = _getPostsListById;//getPostsListById(topicId);

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

    if (topicId == 'favorite' || topicId == 'home') {
      await _refreshPostsListById(topicId);
      await _loadUserInfo({});
      _loadTips();
    }
  }

  useEffect(()=>{
    componentDidMount();
  }, []);

  // let { data = null, filters } = _getPostsListById;

  // if (!data || filters && filters.page_number == 1) return null;
  if (!hasNew) return null;
  return <a styleName="bar" href="javascript:void(0)" onClick={loadNewPosts}>有新的动态</a>
}

/*
@connect(
  (state, props) => {
    const { topicId } = props;
    return {
      me: getProfile(state),
      isMember: isMember(state),
      getPostsListById: id => getPostsListById(state, id),
      hasNew: getTipsById(state, topicId)
    }
  },
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch),
    refreshPostsListById: bindActionCreators(refreshPostsListById, dispatch),
    loadTips: bindActionCreators(loadTips, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)
export default class NewFeedTips extends React.Component {

  static propTypes = {
    // 话题的id
    topicId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      display: false
    }
    this.loadNewPosts = this.loadNewPosts.bind(this);
  }

  async componentDidMount() {

    const { me, topicId, getPostsListById, loadUserInfo, loadTips } = this.props;

    let date = me[`last_find_${topicId}_at`] || '';

    if (!date) return;

    let { data = null } = getPostsListById(topicId);

    if (!data || !data[0]) return;

    // 如果当前帖子的中数据比当前用户的记录要大，说明已经是最新的，更新用户的数据，以及tips状态
    if (topicId == 'favorite' &&
        new Date(date).getTime() < new Date(data[0].last_comment_at).getTime() ||
        new Date(date).getTime() < new Date(data[0].sort_by_date).getTime()
      ) {
        await loadUserInfo({});
        loadTips();
    }
    
  }

  componentWillReceiveProps(props) {
    if (this.props.topicId != props.topicId) {
      this.props = props;
      this.componentDidMount();
    }
  }
  
  async loadNewPosts() {
    const { topicId, refreshPostsListById, loadTips, loadUserInfo } = this.props;

    if (topicId == 'favorite' || topicId == 'excellent' || topicId == 'home') {
      await refreshPostsListById(topicId);
      await loadUserInfo({});
      loadTips();
    }
  }

  render() {
    const { hasNew } = this.props;
    if (!hasNew) return null;
    return <a styleName="bar" href="javascript:void(0)" onClick={this.loadNewPosts}>有新的动态</a>
  }

}
*/