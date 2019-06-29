import React from 'react';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
// import Footer from '@modules/footer';
// import AdsByGoogle from '@modules/adsbygoogle';

import PostsList from '@modules/posts-list';
import FeedList from '@modules/feed-list';
import NewTips from '@modules/feed-list/components/new-tips';
import ADPC from '@modules/ads/pc';

// layout
import TwoColumns from '../../layout/two-columns';

// import { googleAdSense } from '@config';
// import _config from '@config/index';
// const { googleAdSense } = _config;

export default Shell(function() {
  return (
    <div>
      <Meta title="关注" />

      <TwoColumns>
        
        <div>
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

        <div></div>
        
        <div>

          <div className="card">
          <div className="card-header">近7天热门讨论</div>
          <div className="card-body p-0">
            <PostsList
              id={'hot-feed'}
              itemType={'poor'}
              query={{
                  method: 'user_follow',
                  sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
                  start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)+'',
                  deleted: false,
                  weaken: false,
                  page_size: 9
              }}
              />
          </div>
          </div>
          
          <ADPC width='280px' height='280px' />
        </div>

      </TwoColumns>
    </div>
  )
})