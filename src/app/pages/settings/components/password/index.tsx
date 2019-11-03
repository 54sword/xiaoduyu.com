import React, { useState, createRef } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { updatePassword } from '@app/redux/actions/user';
import { getUserInfo, getUnlockToken } from '@app/redux/reducers/user';

export default function() {

  const newPassword = createRef();
  const confirmNewPassword = createRef();

  const [ show, setShow ] = useState(false);
  const [ loading, setLoading] = useState(false);

  const store = useStore();
  const _updatePassword = (args: object)=>updatePassword(args)(store.dispatch, store.getState);

  const me = useSelector((state: object)=>getUserInfo(state));
  const unlockToken = useSelector((state: object)=>getUnlockToken(state));

  const submit = async function(event: any) {

    const $newPassword = newPassword.current;
    const $confirmNewPassword = confirmNewPassword.current;

    if (!$newPassword.value) return $newPassword.focus()
    if (!$confirmNewPassword.value) return $confirmNewPassword.focus()

    if ($newPassword.value != $confirmNewPassword.value) {
      alert('新密码两次输入不相同')
      return
    }

    setLoading(true);

    let err, res;

    let result: any = await _updatePassword({
      new_password: $newPassword.value,
      unlock_token: unlockToken || ''
    });

    [err, res] = result;

    setLoading(false);

    if (res && res.success) {
      Toastify({
        text: '密码修改成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #18c31a, #14a22f)'
      }).showToast();

      $newPassword.value = '';
      $confirmNewPassword.value = '';

      setShow(false);

    } else {
      Toastify({
        text: err,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    }

  }

  const handleShow = function() {

    if (!unlockToken) {
      $('#unlock-token-modal').modal({
        show: true
      }, {
        complete: (res: any)=>{
          if (res) setShow(true);
        }
      });
    } else {
      setShow(true);
    }

  }
  
  if (!me.phone && !me.email) return '';

  return (
    <div className="card">
    <div className="card-header"><div className="card-title">密码</div></div>
    <div className="card-body">
    
    {show &&
        <div>
          <div className="form-group"><input type="password" className="form-control" placeholder="新密码" ref={newPassword}></input></div>
          <div className="form-group"><input type="password" className="form-control" placeholder="重复新密码" ref={confirmNewPassword}></input></div>
          <div>
            {loading ? 
              <span className="btn btn-outline-primary rounded-pill btn-sm">提交中...</span>
              :
              <span className="btn btn-outline-primary rounded-pill btn-sm" onClick={submit}>提交</span>}
          </div>
        </div>}
    
    {!show &&
        <div className="d-flex justify-content-between">
          <div>{me.has_password ? '已设置' : '未设置'}</div>
          <span className="btn btn-outline-primary rounded-pill btn-sm" onClick={handleShow}>{me.has_password ? '修改' : '设置'}</span>
        </div>}
        
    </div>
  </div> 
  )
}