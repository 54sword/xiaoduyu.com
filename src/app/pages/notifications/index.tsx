import React from 'react';

// components
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';

import Notification from '@app/modules/notifications';
import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (
    <SingleColumns>
      <Meta title="通知" />
      <Notification />
    </SingleColumns>
  )
})