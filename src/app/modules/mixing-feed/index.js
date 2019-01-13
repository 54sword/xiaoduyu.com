import React from 'react';

// redux
import { connect } from 'react-redux';
import { getTopicListById } from '@reducers/topic';
import { getTopicId } from '@reducers/website';

import PostsList from '@modules/posts-list';
import FeedList from '@modules/feed-list';

@connect(
  (state, props) => ({
    topicList: getTopicListById(state, 'recommend-topics'),
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
        sort_by: "sort_by_date",
        deleted: false,
        weaken: false
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
          recommend: true
        }
      }
    }

    if (topicId == 'subscribe') {
      filters = {
        variables: {
          method: 'subscribe',
          sort_by: "last_comment_at:-1",
          deleted: false,
          weaken: false
        }
      }
    }

    if (topicId == 'follow') {
      return (<div>
        <FeedList
          id={'feed'}
          filters={{
            variables: {
              preference: true,
              sort_by: "create_at:-1"
            }
          }}
          scrollLoad={true}
          showTips={true}
          />
      </div>)
    } else {
      return (
        <div>
          <PostsList
            id={topicId || 'home'}
            filters={filters}
            scrollLoad={true}
            showTips={true}
            />
        </div>
      )
    }

  }

}
