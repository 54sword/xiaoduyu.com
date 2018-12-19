import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hasNewFeed } from '@reducers/website';
import { loadNewFeed } from '@actions/feed';
import { isMember } from '@reducers/user';
import { getFeedListByName } from '@reducers/feed';

// style
import './index.scss';

@connect(
  (state, props) => ({
    isMember: isMember(state),
    hasNewFeed: hasNewFeed(state),
    list: getFeedListByName(state, 'feed')
  }),
  dispatch => ({
    loadNewFeed: bindActionCreators(loadNewFeed, dispatch)
  })
)
export default class NewFeedTips extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { list, hasNewFeed, loadNewFeed } = this.props;
    if (list && hasNewFeed) loadNewFeed();
  }

  render() {

    const { hasNewFeed, loadNewFeed, isMember } = this.props;

    if (!isMember || !hasNewFeed) return null;

    return(<div onClick={()=>{ loadNewFeed(); }} styleName="unread-tip">有新的帖子</div>)
  }

}
