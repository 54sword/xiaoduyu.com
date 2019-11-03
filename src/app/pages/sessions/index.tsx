import React from 'react';

// modules
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';
import SessionList from './components/session-list';

// layout
import SingleColumns from '@app/layout/single-columns';

export default Shell(function() {
  return (
    <SingleColumns>
      <Meta title="私信" />
      <div className="card">
        <div className="card-header">
          <div className="card-title">我的私信</div>
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