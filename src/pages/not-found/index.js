import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

@Shell
export default class NotFound extends React.PureComponent {
  
  render() {
    return(<div>
      <Meta title="404,无法找到该页面" />
      404,无法找到该页面
    </div>)
  }

}
