import React from 'react';

// components
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';
import ResetPassword from '@app/modules/reset-password';

import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (
    <SingleColumns>
      <Meta title="忘记密码" />
      <ResetPassword />
    </SingleColumns>
  )
})