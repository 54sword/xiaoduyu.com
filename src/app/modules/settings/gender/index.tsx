import React, { useState } from 'react';

// redux
import { useStore, useSelector } from 'react-redux';
import { getUserInfo } from '@reducers/user';
import { loadUserInfo, updateUser } from '@actions/user';

export default function () {
  
  const [ show, setShow ] = useState(false);

  const me = useSelector((state: object)=>getUserInfo(state));

  const store = useStore();
  const _loadUserInfo = (args: any)=>loadUserInfo(args)(store.dispatch, store.getState);
  const _updateUser = (args: any)=>updateUser(args)(store.dispatch, store.getState);


  const submit = async function(isMale: boolean) {

    if (isMale && me.gender == 1 || !isMale && me.gender == 0) {
      setShow(false);
      return
    }

    let [err, res] = await _updateUser({
      gender: isMale ? 1 : 0
    });

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
      setShow(false);
    }
    
  }

  const handleShow = function() {
    setShow(true);
  }

  return (
    <div>
    <div className="card">
      <div className="card-header">性别</div>
      <div className="card-body" style={{padding:'20px'}}>

        {!show ?
          <div className="d-flex justify-content-between">
            <div>{me.gender === 0 ? '女' : null}{me.gender === 1 ? '男' : null}</div>
            <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={handleShow}>修改</a>
          </div>
          :
          <div className="list-group">
            <button type="button" className={`list-group-item list-group-item-action ${me.gender === 1 ? 'active' : ''}`} onClick={()=>{ submit(true) }}>
              男
            </button>
            <button type="button" className={`list-group-item list-group-item-action ${me.gender === 0 ? 'active' : ''}`} onClick={()=>{ submit(false) }}>
              女
            </button>
          </div>}

      </div>
    </div>

    </div>
  )
}