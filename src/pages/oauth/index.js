import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';
import OAuth from '@modules/oauth';

@Shell
export default class OAuthPage extends React.PureComponent {

  render() {
    return (<>
      <Meta title="登陆中..." />
      <OAuth />
    </>)
  }

}
