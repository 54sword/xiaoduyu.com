import React from 'react';

import PostsList from '@app/modules/posts-list';
import NewTips from '@app/modules/posts-list/components/new-tips';

export default () => {

  return(
    <>
    <div className="card rounded-bottom">
      <div className="card-body p-0">
        <NewTips topicId="home" />
        <PostsList
          id="home"
          query={{
            sort_by: "sort_by_date",
            deleted: false,
            weaken: false
          }}
          scrollLoad={true}
          />
      </div>
    </div>
    </>
  );

}
