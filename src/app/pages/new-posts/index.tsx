import React from 'react';

// components
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';
import CreatePosts from './components/create-posts';

import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (<>
    <Meta title={'创建话题'} />
    <SingleColumns>
      <CreatePosts />
    </SingleColumns>
  </>)
})