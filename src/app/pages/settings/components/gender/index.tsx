import React, { useState } from 'react';

// redux
import { useStore, useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { loadUserInfo, updateUser } from '@app/redux/actions/user';

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

    let err, res;

    let result: any = await _updateUser({
      gender: isMale ? 1 : 0
    });

    [err, res] = result;

    if (err) {
      $.toast({
        text: err.message,
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'error',
        loader: false,
        allowToastClose: false
      });
    } else {

      $.toast({
        text: '修改成功',
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'success',
        loader: false,
        allowToastClose: false
      });

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
      <div className="card-header"><div className="card-title">性别</div></div>
      <div className="card-body">

        {!show ?
          <div className="d-flex justify-content-between">
            <div>{me.gender === 0 ? '女' : null}{me.gender === 1 ? '男' : null}</div>
            <span className="btn btn-outline-primary rounded-pill btn-sm" onClick={handleShow}>修改</span>
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