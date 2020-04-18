import React from 'react';

// layout
import TwoColumns from '@app/layout/two-columns';

// components
import FeedList from '@app/components/feed-list';
import FeedNewTips from '@app/components/feed-list/components/new-tips';
import PostsList from '@app/components/posts-list';
import ADPC from '@app/components/ads/pc';

import LiveNow from '@app/components/live/now';

export default () => {
  return (<TwoColumns>
    <div>

      <LiveNow />
      
      <div className="card">
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
      </div>

    </div>
    
    <div></div>

    <div>
      <div className="card">
        <div className="card-header"><b>推荐</b></div>
        <div className="card-body p-0">
          <PostsList
            id="excellent"
            itemType="poor"
            query={{
              sort_by: "sort_by_date",
              deleted: false,
              weaken: false,
              recommend: true
            }}
            />
        </div>
      </div>
      <ADPC width="250px" height="250px" />
    </div>

  </TwoColumns>)
}
