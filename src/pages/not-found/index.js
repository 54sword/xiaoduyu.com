import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

@Shell
export default class NotFound extends React.PureComponent {
  
  render() {
    return(<>
      <Meta title="404,无法找到该页面" />
      <div className="text-center mt-5"><h3>404,无法找到该页面</h3></div>
    </>)
  }

}
