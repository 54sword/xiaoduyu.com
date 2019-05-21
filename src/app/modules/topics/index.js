import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopicList } from '@actions/topic';
import { getTopicListById } from '@reducers/topic';
import { getProfile } from '@reducers/user';

import Render from './render';


@connect(
  (state, props) => ({
    me: getProfile(state),
    topicList: getTopicListById(state, 'recommend-topics')
  }),
  dispatch => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)
export default class Topics extends React.PureComponent {

  componentDidMount() {

    const { topicList, loadTopicList } = this.props;

    if (!topicList ||
        !topicList.data ||
        !topicList.data.length
    ) {
      loadTopicList({
        id: 'recommend-topics',
        filters: { variables: { type: "parent", recommend: true, sort_by: 'sort:-1' } }
      });
    }

  }


  render() {

    const { topicList, me } = this.props;

    if (!topicList) return null;

    const { loading, count, more, data = [] } = topicList;

    return <Render loading={loading} topicList={data} me={me} />;
  }
}