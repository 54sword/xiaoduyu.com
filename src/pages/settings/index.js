import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

// modules
import Setting from '@modules/setting';

// layout
import ThreeColumns from '../../layout/three-columns';

@Shell
export default class Settings extends React.PureComponent {

  render() {
    return (<ThreeColumns>

      <div></div>
      
      <div>
        <Meta title='设置' />        
        <Setting />
      </div>
          
    </ThreeColumns>)
  }

}