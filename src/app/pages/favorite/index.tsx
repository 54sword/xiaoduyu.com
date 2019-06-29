import React from 'react';

// config
// import { googleAdSense } from '@config';
// import _config from '@config/index';
// const { googleAdSense } = _config;

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
// import OperatingStatus from '@modules/operating-status';
// import Footer from '@modules/footer';
// import AdsByGoogle from '@modules/adsbygoogle';
import PostsList from '@modules/posts-list';
import NewTips from '@modules/posts-list/components/new-tips';
import ADPC from '@modules/ads/pc';

// layout
import TwoColumns from '../../layout/two-columns';

export default Shell(function() {
  return (
    <div>
      <Meta title="收藏" />

      <TwoColumns>

        <div>
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

        <div></div>
        
        <div>

          <div className="card">
          <div className="card-header">近7天热门讨论</div>
          <div className="card-body p-0">
            <PostsList
              id={'hot-favorite'}
              itemType={'poor'}
              query={{
                method: 'favorite',
                deleted: false,
                weaken: false,
                sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
                start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)+''
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