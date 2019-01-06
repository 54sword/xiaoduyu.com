import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

import SingleColumns from '../../layout/single-columns';

import CreatePosts from '@modules/create-posts';

@Shell
export default class CreatePostsPage extends React.PureComponent {
  
  render() {
    return (<SingleColumns>
      <Meta title={'创建帖子'} />
      <CreatePosts />
    </SingleColumns>)
  }

}
