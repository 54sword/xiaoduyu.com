import React from 'react';

import FeedList from '@app/modules/feed-list';
import FeedNewTips from '@app/modules/feed-list/components/new-tips';

export default () => {
  return (<div className="card">
    <div className="card-header">
      <div className="card-title">我的关注</div>
    </div>
    <div className="card-body p-0">
      <FeedNewTips topicId="feed" />
      <FeedList
        id='feed'
        query={{
          preference: true,
          sort_by: "create_at:-1"
        }}
        scrollLoad={true}
        nothing={'关注你感兴趣的人或话题，可以获得ta们的最新动态'}
        />
    </div>
  </div>)
}
