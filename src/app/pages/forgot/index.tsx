import React from 'react';

// components
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';
import ResetPassword from './components/reset-password';

import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (
    <SingleColumns>
      <Meta title="忘记密码" />
      <ResetPassword />
    </SingleColumns>
  )
})