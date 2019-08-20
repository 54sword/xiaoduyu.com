import React from 'react';

// modules
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';
import SessionList from '@app/modules/session-list';

// layout
import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (
    <SingleColumns>
      <Meta title="私信" />
      <div className="card">
        <div className="card-header">
          <div className="title">我的私信</div>
        </div>
        <div className="card-body p-0">
          <SessionList
            id="all"
            scrollLoad={true}
            query={{
              sort_by:'last_message:-1'
            }}
            />
        </div>
      </div>
    </SingleColumns>
  )
})