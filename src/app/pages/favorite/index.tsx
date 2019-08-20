import React from 'react';

// modules
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';
import PostsList from '@app/modules/posts-list';
import NewTips from '@app/modules/posts-list/components/new-tips';

// layout
import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (
    <div>
      <Meta title="收藏" />

      <SingleColumns>

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

      </SingleColumns>
    </div>
  )

})