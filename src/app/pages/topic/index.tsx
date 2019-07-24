import React from 'react';

// layout
import SingleColumns from '../../layout/single-columns';

// modules
import Shell from '@modules/shell';
import Topics from '@modules/topics';

export default Shell(() => {

  return(<div>
    <SingleColumns>
        <Topics showAll={true} />
    </SingleColumns>
  </div>)

});
