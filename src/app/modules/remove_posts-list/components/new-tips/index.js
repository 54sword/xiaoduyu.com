import React from 'react';
import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember, getProfile } from '@reducers/user';
import { getPostsListById } from '@reducers/posts';
import { loadPostsList, refreshPostsListById } from '@actions/posts';
import { loadTips } from '@actions/tips';
import { loadUserInfo } from '@actions/user';
import { getTipsById } from '@reducers/tips';

// style
import './index.scss';

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
