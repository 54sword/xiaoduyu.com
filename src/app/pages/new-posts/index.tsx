import React from 'react';

// components
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';
import CreatePosts from '@app/modules/create-posts';

import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (<>
    <Meta title={'创建帖子'} />
    <SingleColumns>
      <CreatePosts />
    </SingleColumns>
  </>)
})