import React from 'react';

// layout
import SingleColumns from '@app/layout/single-columns';

// modules
import Shell from '@app/modules/shell';
import Topics from '@app/modules/topics';
import Meta from '@app/modules/meta';

export default Shell(() => {

  return(<div>
    <Meta title="话题" />
    <SingleColumns>
      <Topics />
    </SingleColumns>
  </div>)

});
