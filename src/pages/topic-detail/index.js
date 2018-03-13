import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopics } from '../../actions/topic';
import { getTopicListByKey } from '../../reducers/topic';

import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import Sidebar from '../../components/sidebar';

@connect(
  (state, props) => ({
    topicList: getTopicListByKey(state, props.match.params.id)
  }),
  dispatch => ({
    loadTopics: bindActionCreators(loadTopics, dispatch)
  })
)
export class TopicsDetail extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const { topicList, loadTopics } = this.props
    const { id } = this.props.match.params

    if (topicList) return;

    loadTopics({
      id: id,
      filters: {
        variables: {
          _id: id
        }
      }
    });

  }

  render() {

    const { id } = this.props.match.params;
    const { pathname } = this.props.location;
    const { topicList } = this.props;
    const topic = topicList && topicList.data[0] ? topicList.data[0] : null;

    if (!topic) return '';
    if (!topic.children) return '没有相关帖子';

    return(<div>

      <Meta title={topic.name} />
      <div className="container">

      <div className="row">
        <div className="col-md-9">
          <PostsList
            id={pathname}
            filters={{
              variables: {
                sort_by: "create_at",
                deleted: false,
                weaken: false,
                topic_id: topic.children
              }
            }}
            showPagination={false}
            />
        </div>
        <div className="col-md-3">
          <Sidebar
            id={'sidebar_'+pathname}
            topic_id={topic.children}
            />
        </div>
      </div>

      </div>
    </div>)
  }

}

export default Shell(TopicsDetail);
