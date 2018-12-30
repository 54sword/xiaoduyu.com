import React from 'react';

// redux
import { connect } from 'react-redux';
import { getTopicListByKey } from '@reducers/topic';
import { getTopicId } from '@reducers/website';

import PostsList from '@modules/posts-list';
// import FeedList from '@modules/feed-list';

import './index.scss';

@connect(
  (state, props) => ({
    topicList: getTopicListByKey(state, 'recommend-topics'),
    topicId: getTopicId(state)
  }),
  dispatch => ({
  })
)
export default class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { topicList, topicId } = this.props;
    
    let ids = [];
    let filters = {
      variables: {
        // sort_by: "sort_by_date",
        sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
        start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7),
        deleted: false,
        weaken: false,
        page_size: 6
      }
    }

    if (topicId) {
      topicList.data.map(item=>{
        item.children.map(i=>{
          if (item._id == topicId || i._id == topicId) {
            ids.push(i._id);
          }
        });
      });
      if (ids.length > 0) {
        filters.variables.topic_id = ids.join(',');
      }
    }

    if (topicId == 'excellent') {
      filters = {
        variables: {
          sort_by: "sort_by_date",
          deleted: false,
          weaken: false,
          recommend: true,
          page_number: 6
        }
      }
    }

    if (topicId == 'subscribe') {
      filters = {
        variables: {
          method: 'subscribe',
          sort_by: "last_comment_at:-1",
          deleted: false,
          weaken: false,
          page_number: 6
        }
      }
    }

    if (topicId == 'follow') {
      return null;
    } else {
      return (
        <div className="card">
        <div className="card-header">热门讨论</div>
        <div className="card-body" styleName="body">
        <PostsList
            id={'hot-'+(topicId || 'home')}
            itemType={'poor'}
            filters={filters}
            scrollLoad={false}
            showTips={false}
            />
        </div>
        </div>
      )
    }

  }

}
