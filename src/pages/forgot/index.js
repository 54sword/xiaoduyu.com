import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

import SingleColumns from '../../layout/single-columns';
import ResetPassword from '@modules/reset-password';

@Shell
export default class Forgot extends React.PureComponent {
  render() {
    return (
      <SingleColumns>
        <Meta title="忘记密码" />
        <ResetPassword />
      </SingleColumns>
    )
  }
}
