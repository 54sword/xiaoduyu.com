import React from 'react';

import * as globalData from '@app/common/global-data';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { loadUserInfo, updateUser } from '@app/redux/actions/user';

export default function() {

  const me = useSelector((state: object)=>getUserInfo(state));

  const store = useStore();
  const _updateUser = (args: object)=>updateUser(args)(store.dispatch, store.getState);
  const _loadUserInfo = (args: object)=>loadUserInfo(args)(store.dispatch, store.getState);

  const onChange = async function(e: any) {

    let theme = parseInt(e.target.value);

    let err, res;
    
    let result: any = await _updateUser({ theme });

    [err, res] = result;

    if (err) {

      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    } else {
      Toastify({
        text: '修改成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
      _loadUserInfo({});

      $('html').attr('id', theme == 1 ? 'light-theme' : 'dark-theme');

      globalData.get('service-worker').uninstall();

    }
    
  }

  return (
    <div className="card">
      <div className="card-header"><div className="card-title">主题</div></div>
      <div className="card-body">
        <select onChange={onChange} defaultValue={me.theme || '1'}>
          <option value="1">浅色</option>
          <option value="2">暗色</option>
        </select>
      </div>
    </div>
  )
}