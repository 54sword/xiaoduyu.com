import React from 'react'

// config
import _config from '@config/index';
const { APIDomainName } = _config;

// redux
import { useSelector, useStore } from 'react-redux'
import { getUserInfo, getAccessToken } from '@reducers/user'
import { loadUserInfo } from '@actions/user'
import { oAuthUnbinding } from '@actions/oauth'

// styles
import './style.scss'

export default function() {

  const me = useSelector((state: object)=>getUserInfo(state));
  const accessToken = useSelector((state: object)=>getAccessToken(state));

  const store = useStore();
  const _loadUserInfo = (args: any)=>loadUserInfo(args)(store.dispatch, store.getState);
  const _oAuthUnbinding = (args: any)=>oAuthUnbinding(args)(store.dispatch, store.getState);

  const submit = async function(name: string) {
    
    if (me[name]) {

      if (confirm(`您确认解除 ${name} 的绑定吗？`)) {

        let [ err, res ] = await _oAuthUnbinding({
          args: { name }
        });

        await _loadUserInfo({});

        Toastify({
          text: '解除成功',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
        }).showToast();

      }

    } else {
      if (confirm(`您确认绑定 ${name} 吗？`)) {
        window.location.href = `${APIDomainName}/oauth/${name}?access_token=${accessToken}`;
      }
    }

  }

  return (
    <div className="card">
    <div className="card-header">第三方帐号</div>
      <div className="card-body">
        <div className="container">
        <div className="row">
          <div className="col-4">
            <div>QQ</div>
            <div><a href="javascript:void(0)" onClick={()=>{ submit('qq'); }}>{me.qq ? '已绑定' : '未绑定' }</a></div>
          </div>
          <div className="col-4">
            <div>微博</div>
            <div><a href="javascript:void(0)" onClick={()=>{ submit('weibo'); }}>{me.weibo ? '已绑定' : '未绑定' }</a></div>
          </div>
          <div className="col-4">
            <div>GitHub</div>
            <div><a href="javascript:void(0)" onClick={()=>{ submit('github'); }}>{me.github ? '已绑定' : '未绑定' }</a></div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )

}
