import React from 'react';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import ResetPassword from '@modules/reset-password';

import SingleColumns from '../../layout/single-columns';

export default Shell(function() {
  return (
    <SingleColumns>
      <Meta title="忘记密码" />
      <ResetPassword />
    </SingleColumns>
  )
})