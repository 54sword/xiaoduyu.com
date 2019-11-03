import React from 'react';

import TwoColumns from '@app/layout/two-columns';

// modules
import PostsList from '@app/components/posts-list';
import NewTips from '@app/components/posts-list/components/new-tips';
import ADPC from '@app/components/ads/pc';

export default function() {
  return (<TwoColumns>
    
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">我的收藏</div>
        </div>
        <div className="card-body p-0">
          <NewTips topicId="favorite" />
          <PostsList
            id={'favorite'}
            query={{
                method: 'favorite',
                sort_by: "last_comment_at:-1",
                deleted: false,
                weaken: false
            }}
            scrollLoad={true}
            nothing="收藏你感兴趣的帖子，可以获得帖子的最新动态"
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