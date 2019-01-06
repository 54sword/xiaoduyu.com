import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

// modules
import Setting from '@modules/setting';

// layout
import SingleColumns from '../../layout/single-columns';

@Shell
export default class Settings extends React.PureComponent {

  render() {
    return (<SingleColumns>      
      <Meta title='设置' />        
      <Setting />
    </SingleColumns>)
  }
  
}