import React, { createRef, useState } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { updateUser, loadUserInfo } from '@app/redux/actions/user';

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

    let err, res;

    let result: any = await updateUser({
      brief: value
    })(store.dispatch, store.getState);

    [ err, res ] = result;

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
        <div className="w-75">{me.brief || '未知签名'}</div>
        <div>
          <span className="btn btn-outline-primary rounded-pill btn-sm" onClick={handleShow}>修改</span>
        </div>
      </div>);
  
  if (show) {
    dom = (<div>
      <div className="form-group">
        <input id="brief" className="form-control" defaultValue={me.brief} ref={brief} ></input>
      </div>
      {loading ?
        <span className="btn btn-outline-primary rounded-pill btn-sm">提交中...</span>
        : <span className="btn btn-outline-primary rounded-pill btn-sm" onClick={submit}>提交</span>}
    </div>)
  }

  return (
    <div className="card">
      <div className="card-header"><div className="card-title">个性签名</div></div>
      <div className="card-body">{dom}</div>
    </div>
  )

}