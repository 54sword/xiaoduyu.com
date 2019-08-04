import React from 'react'

// config
import { api, social } from '@config/index';

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

        let err, res;

        let result: any = await _oAuthUnbinding({
          args: { name }
        });

        [ err, res ] = result;

        await _loadUserInfo({});

        Toastify({
          text: '解除成功',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
        }).showToast();

      }

    } else {
      if (confirm(`您确认绑定 ${name} 吗？`)) {
        window.location.href = `${api.domain}/oauth/${name}?access_token=${accessToken}`;
      }
    }

  }

  let doms = [];

  if (social.weibo) {
    doms.push(<>
      <div>微博</div>
      <div><a href="javascript:void(0)" onClick={()=>{ submit('weibo'); }}>{me.weibo ? '已绑定' : '未绑定' }</a></div>
    </>)
  }

  if (social.qq) {
    doms.push(<>
      <div>QQ</div>
      <div><a href="javascript:void(0)" onClick={()=>{ submit('qq'); }}>{me.qq ? '已绑定' : '未绑定' }</a></div>
    </>)
  }

  if (social.github) {
    doms.push(<>
      <div>GitHub</div>
      <div><a href="javascript:void(0)" onClick={()=>{ submit('github'); }}>{me.github ? '已绑定' : '未绑定' }</a></div>
    </>)
  }
  
  if (social.wechat) {
    doms.push(<>
      <div>微信</div>
      <div><a href="javascript:void(0)" onClick={()=>{ submit('wechat'); }}>{me.wechat ? '已绑定' : '未绑定' }</a></div>
    </>)
  }
  
  return (
    <div className="card">
      <div className="card-head pb-0"><div className="title">第三方帐号</div></div>
      <div className="card-body" style={{overflow:'hidden'}}>
        <div className="row">
          {doms.map((item, index)=>{
            return (<div key={index} className={`col-${12/doms.length}`}>
              {item}
            </div>)
          })}
        </div>
      </div>
    </div>
  )

}
