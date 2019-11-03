import React from 'react';

// modules
import LiveList from '@app/components/live';

import './styles/index.scss';

export default () => {
  return(<div className="container">
      {/* <div className="pb-3 pt-1 text-secondary">
        当前直播功能还是测试版本，只有站长有权限开启直播
      </div> */}
      <LiveList id="lives-online" query={{ }} />
  </div>);
}
