import React from 'react';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';

import Notification from '@modules/notifications';
import SingleColumns from '../../layout/single-columns';

export default Shell(function() {
  return (
    <SingleColumns>
      <Meta title="通知" />
      <Notification />
    </SingleColumns>
  )
})