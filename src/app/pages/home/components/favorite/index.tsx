import React from 'react';

// modules
import PostsList from '@app/modules/posts-list';
import NewTips from '@app/modules/posts-list/components/new-tips';

export default function() {
  return (
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
  )

}