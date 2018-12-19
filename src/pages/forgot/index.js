import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

import ThressColumns from '../../layout/three-columns';
import ResetPassword from '@modules/reset-password';

@Shell
export default class Forgot extends React.PureComponent {
  render() {
    return (
      <ThressColumns>
        <div></div>
        <div>
          <Meta title="忘记密码" />
          <ResetPassword />
        </div>
      </ThressColumns>
    )
  }
}
