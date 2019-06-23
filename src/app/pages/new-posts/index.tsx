import React from 'react';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import CreatePosts from '@modules/create-posts';

import SingleColumns from '../../layout/single-columns';

export default Shell(function() {
  return (<>
    <Meta title={'创建帖子'} />
    <SingleColumns>
      <CreatePosts />
    </SingleColumns>
  </>)
})