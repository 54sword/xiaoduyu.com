import React from 'react';

// components
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';

import Notification from './components/notifications';

import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (
    <SingleColumns>
      <Meta title="通知" />
      <Notification />
    </SingleColumns>
  )
})