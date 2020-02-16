import React from 'react';



import * as globalData from '@app/common/global-data';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { loadUserInfo, updateUser } from '@app/redux/actions/user';

import switchTheme from '@src/client/theme';

import lightImage from './styles/images/light.png';
import darkImage from './styles/images/dark.png';
import lightAndDarkImage from './styles/images/light-and-dark.png';

import './styles/index.scss';

export default function() {

  const me = useSelector((state: object)=>getUserInfo(state));

  const store = useStore();
  const _updateUser = (args: object)=>updateUser(args)(store.dispatch, store.getState);
  const _loadUserInfo = (args: object)=>loadUserInfo(args)(store.dispatch, store.getState);

  const onChange = async function(theme: number) {

    // let theme = e.target.checked ? 2 : 1;

    let err, res;
    
    let result: any = await _updateUser({ theme });
    
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
      _loadUserInfo({});
      switchTheme({ theme });
      globalData.get('service-worker').uninstall();
    }
    
  }

  return (
    <div className="card">
      <div className="card-header"><div className="card-title">外观</div></div>
      <div className="card-body">
          <span styleName="item" className={me.theme == 0 ? 'bg-primary' : 'a'} onClick={()=>onChange(0)}>
            <img src={lightAndDarkImage} /><br />
            自动模式
          </span>
          <span  styleName="item" className={me.theme == 1 ? 'bg-primary' : 'a'} onClick={()=>onChange(1)}>
            <img src={lightImage} /><br />
            浅色模式
          </span>
          <span styleName="item" className={me.theme == 2 ? 'bg-primary' : 'a'} onClick={()=>onChange(2)}>
            <img src={darkImage} /><br />
            暗色模式
          </span>
          <div className="mt-2 text-muted">
            <small>
              自动模式时间范围，早上7点 - 晚上8点为浅色模式，晚上9点 - 早上6点暗色模式
            </small>
          </div>
      </div>
    </div>
  )
}