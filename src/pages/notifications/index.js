import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

import Notification from '@modules/notifications';
import SingleColumns from '../../layout/single-columns';

@Shell
export default class NotificationsPage extends React.PureComponent {

  render () {
    return (<SingleColumns>
      <Meta title="通知" />
      <Notification />
    </SingleColumns>)
  }

}
