import React, { useState, createRef } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { updateUser, loadUserInfo } from '@app/redux/actions/user';

export default function() {

  const nickname = createRef();

  const [ show, setShow ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const me = useSelector((state: object)=>getUserInfo(state));

  const store = useStore();
  const _loadUserInfo = (args: any)=>loadUserInfo(args)(store.dispatch, store.getState);
  const _updateUser = (args: any)=>updateUser(args)(store.dispatch, store.getState);

  const submit = async function() {

    const $nickname = nickname.current;

    if (!$nickname.value) {
      $nickname.focus();
      return;
    }

    if (me.nickname == $nickname.value) {
      setShow(false);
      return;
    }

    setLoading(true);

    let err;

    let result: any = await _updateUser({
      nickname: $nickname.value
    });

    [ err ] = result;

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
    setLoading(false);
  }

  const handleShow = function() {
    setShow(true);
  }

  return (
    <div>

    <div className="card">
      <div className="card-header"><div className="card-title">名字</div></div>
      <div className="card-body">

        {!show ?
          <div className="d-flex justify-content-between">
            <div>{me.nickname || ''}</div>
            <a className="btn btn-outline-primary rounded-pill btn-sm" href="javascript:void(0);" onClick={handleShow}>修改</a>
          </div>
          :
          <div>
            <div>
              <input type="text" className="form-control" defaultValue={me.nickname} ref={nickname} placeholder="请输入你的名字"></input>
            </div>
            <br />
            {loading ?
              <a className="btn btn-outline-primary rounded-pill btn-sm" href="javascript:void(0);">提交中...</a>
              :
              <a className="btn btn-outline-primary rounded-pill btn-sm" href="javascript:void(0);" onClick={submit}>提交</a>}
            
          </div>}

      </div>
    </div>

    </div>
  )
}