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
import SingleColumns from '../../layout/single-columns';

export default Shell(function() {
  return (
    <div>
      <Meta title="收藏" />

      <SingleColumns>

        <div className="card">
          <div className="card-head pb-1">
            <div className="title">我的收藏</div>
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

      </SingleColumns>
    </div>
  )

})