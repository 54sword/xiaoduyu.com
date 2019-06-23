import React from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getProfile } from '@reducers/user';
import { loadUserInfo, updateUser } from '@actions/user';

export default function() {

  const me = useSelector((state: object)=>getProfile(state));

  const store = useStore();
  const _updateUser = (args: object)=>updateUser(args)(store.dispatch, store.getState);
  const _loadUserInfo = (args: object)=>loadUserInfo(args)(store.dispatch, store.getState);

  const onChange = async function(e: any) {

    let theme = parseInt(e.target.value);
    
    let [err, res] = await _updateUser({ theme });

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
    }
    
  }

  return (
    <div className="card">
      <div className="card-header">主题</div>
      <div className="card-body" style={{padding:'20px'}}>
        <select onChange={onChange} defaultValue={me.theme || '1'}>
          <option value="1">浅色</option>
          <option value="2">暗色</option>
        </select>
      </div>
    </div>
  )
}