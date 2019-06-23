import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';

// redux
import { useStore } from 'react-redux';
import { saveTokenToCookie } from '@actions/sign';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';

export default Shell(function() {

  const { location } = useReactRouter();

  const store = useStore();

  const _saveTokenToCookie = (args: object)=>saveTokenToCookie(args)(store.dispatch, store.getState);

  useEffect(()=>{

    const { access_token = '', expires = 0, landing_page = '/' } = location.params;
    
    if (access_token) {

      _saveTokenToCookie({ access_token }).then((res: any)=>{
        if (res && res.success) {
          window.location.href = landing_page;
        }
      }).catch((err:any)=>{
        alert('登录失败');
        window.location.href = '/';
      });
      
    } else {
      window.location.href = '/';
    }


  });

  return (
    <>
      <Meta title="登陆中..." />
      <div style={{textAlign:'center', padding:'30px'}}>
        登录跳转中...
      </div>
    </> 
  )
})