import React from 'react';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';

import SingleColumns from '../../layout/single-columns';
import ResetPassword from '@modules/reset-password';

@Shell
export default class ForgotPage extends React.PureComponent {
  render() {
    return (
      <SingleColumns>
        <Meta title="忘记密码" />
        <ResetPassword />
      </SingleColumns>
    )
  }
}
