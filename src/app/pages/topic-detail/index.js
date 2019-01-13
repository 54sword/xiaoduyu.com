import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopics } from '@actions/topic';
import { getTopicListById } from '@reducers/topic';

import SingleColumns from '../../layout/single-columns';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import Loading from '@components/ui/full-loading';

import PostsList from '@modules/posts-list';
import PostsCard from '@modules/topic-card';

/**
 * 分析url上面的参数
 * @param  {String} search location.search
 * @return {Object}        符合的参数对象
 */
const analyzeUrlParams = (params) => {

  let whiteParams = {};
  let whiteList = {
    page_number: s => parseInt(s)
  }

  for (let i in params) {
    if (whiteList[i]) whiteParams[i] = whiteList[i](params[i])
  }

  return whiteParams;
}

@Shell
@connect(
  (state, props) => ({
    list: getTopicListById(state, props.match.params.id)
  }),
  dispatch => ({
    loadTopics: bindActionCreators(loadTopics, dispatch)
  })
)
export default class TopicsDetailPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // url上的参数
      searchParams: {}
    }
  }

  async componentDidMount() {

    this.state.searchParams = analyzeUrlParams(this.props.location.params);

    const { id } = this.props.match.params;
    let { list, loadTopics, notFoundPgae } = this.props;

    if (!list || !list.data) {
      await loadTopics({
        id,
        filters: { query: { _id: id } }
      });
    }

    list = this.props.list;

    if (!list || list && list.data && !list.data[0]) {
      notFoundPgae('该话题不存在');
    }

  }

  componentWillReceiveProps(props) {
    if (this.props.location.pathname + this.props.location.search != props.location.pathname + props.location.search) {
      this.props = props;
      this.componentDidMount();
    }
  }

  render() {

    const { data = [], loading = false } = this.props.list || {};
    const topic = data[0] || null;
    const { searchParams } = this.state;

    if (!topic || loading) return <Loading />;

    return(<SingleColumns>

      <Meta title={topic.name} />

      <PostsCard topic={topic} />

      <PostsList
        id={topic._id}
        filters={{
          query: {
            sort_by: "sort_by_date:-1",
            deleted: false,
            weaken: false,
            page_size: 30,
            topic_id: topic._id,
            ...searchParams
          }
        }}
        scrollLoad={true}
        />

    </SingleColumns>)
  }

}
