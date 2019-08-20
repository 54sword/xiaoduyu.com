import React from 'react';

// modules
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';

import FeedList from '@app/modules/feed-list';
import NewTips from '@app/modules/feed-list/components/new-tips';

// layout
import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (
    <div>
      <Meta title="关注" />

      <SingleColumns>
        
        <div className="card">
          <div className="card-head pb-1">
            <div className="title">我的关注</div>
          </div>
          <div className="card-body p-0">
            <NewTips topicId="feed" />
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

      </SingleColumns>
    </div>
  )
})