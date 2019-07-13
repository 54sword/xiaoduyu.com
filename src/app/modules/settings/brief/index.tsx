import React, { createRef, useState } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@reducers/user';
import { updateUser, loadUserInfo } from '@actions/user';

export default function() {

  const brief = createRef();

  const store = useStore();
  const [ loading, setLoading ] = useState(false);
  const [ show, setShow ] = useState(false);

  const me = useSelector((state:object)=>getUserInfo(state));

  const submit = async () => {

    const value = brief.current.value;

    if (value == me.brief) return setShow(false);

    setLoading(true);

    let [ err, res ] = await updateUser({
      brief: value
    })(store.dispatch, store.getState);

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

      loadUserInfo({})(store.dispatch, store.getState);

      setShow(false);
    }

    setLoading(false);

  }

  const handleShow = async function() {
    await setShow(true);
    $('#brief').focus();
  }

  let dom = (<div className="d-flex justify-content-between">
        <div>{me.brief || '未知签名'}</div>
        <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={handleShow}>修改</a>
      </div>);

  if (show) {
    dom = (<div>
      <div className="form-group">
        <input id="brief" className="form-control" defaultValue={me.brief} ref={brief} ></input>
      </div>
      {loading ?
        <a className="btn btn-primary btn-sm" href="javascript:void(0);">提交中...</a>
        : <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={submit}>提交</a>}
    </div>)
  }

  return (
    <div className="card">
      <div className="card-header">个性签名</div>
      <div className="card-body" style={{padding:'20px'}}>{dom}</div>
    </div>
  )

}