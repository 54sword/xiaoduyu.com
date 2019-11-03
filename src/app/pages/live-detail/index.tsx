import React, { useState, useEffect, useRef } from 'react';
import useReactRouter from 'use-react-router';

import agoraClient from './agora';

import * as browser from '@app/common/browser';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadLiveList } from '@app/redux/actions/live';
import { getLiveListById } from '@app/redux/reducers/live';

// components
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';
import Loading from '@app/components/ui/loading';
import Share from '@app/components/share';

// children componet
import ActiveInfo from './components/active-info';
import TalkRoom from './components/talk-room';

// styles
import './styles/index.scss';

let playControl: any = null;

export default Shell(function({ setNotFound }: any) {

  const { match } = useReactRouter();
  const { id }: any = match.params || {};

  const containerRef = useRef();
  const [ supportWebRTC, setSupportWebRTC ] = useState(true);
  const [ iOSWeChat, setiOSWeChat ] = useState(false);
  const [ androidWeChat, setAndroidWeChat ] = useState(false);
  const [ showRoom, setShowRoom ] = useState(false);

  const list = useSelector((state: object)=>getLiveListById(state, id));

  const store = useStore();
  const _loadLiveList = (args: any)=>loadLiveList(args)(store.dispatch, store.getState);

  const loadAgoraSDK = function({ status, _id, user_id }: { status: boolean, _id: string, user_id: any }) {

    return new Promise((resolve)=>{

      if(!window.AgoraRTC) {
        const oHead: any = document.getElementsByTagName('head').item(0);
        var oScript= document.createElement("script");
        oScript.onload = function(){
          resolve(agoraClient(window.AgoraRTC, _id));

        }
        oScript.type = "text/javascript";
        oScript.src = "/agora/AgoraRTCSDK-2.8.0.js";
        oHead.appendChild(oScript);
      } else {
        resolve(agoraClient(window.AgoraRTC, _id));
      }

    })

  }

  const playLive = function(live: any) {

    // 浏览器判断
    if (browser.isiOSWechat()) {
      setiOSWeChat(true);
      return;
    }

    if (browser.isAndroidWechat()) {
      setAndroidWeChat(true);
      return;
    }

    // 未进行直播
    if (!live.status) return;
    
    loadAgoraSDK(live)
    .then((res: any)=>{

      // console.log(res);

      if (!res) {
        // 浏览器不支持 WebRTC
        setSupportWebRTC(false);
        return;
      }

      const { play, stop } = res;

      if (browser.isSafari()) {
        playControl = play;
      } else {
        setShowRoom(true);
      }

    });

    /*
    // 网页直播
    // 申请麦克风和摄像头权限
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
    })
    .catch(function(err) {
      console.log(err);
    });
    */

  }

  const onResize = function() {
    let width = $(window).width();
    let height = Math.ceil(((width-365) / 835) * 650);

    if (width <= 767) {
      $(containerRef.current).css("width",'');
      $(containerRef.current).css("height",'');
      $('#video').css("height",'');
    } else if (height < 650) {
      $(containerRef.current).css("width",width+'px');
      $(containerRef.current).css("height",height+'px');
      $('#video').css("height",(height-80)+'px');
    } else {
      $(containerRef.current).css("width",'');
      $(containerRef.current).css("height",'650px');
      $('#video').css("height",650-80+'px');
    }
  }

  useEffect(()=>{

    $(window).resize(function() {
      onResize();
    });

    setTimeout(()=>{
      onResize();
    }, 500);

    let live = list && list.data && list.data[0] ? list.data[0] : null;

    // 如果已经存在 list，说明redux已经存在该帖子数据，则可以不重新请求
    if (!live) {

      _loadLiveList({
        id,
        args: {
          _id: id
        }
      }).then(([err, res]:any)=>{
        if (res && res.data && res.data[0]) {
          live = res.data[0];
          playLive(live);
        } else {
          setNotFound('live不存在');
        }
      })

    } else if (list && list.data && !list.data[0]) {
      setNotFound('404 live不存在');
    } else {
      live = list.data[0];
      playLive(live);
    }

  },[id]);

  const { loading, data }: any = list || {};
  const live = data && data[0] ? data[0] : null;

  if (loading || !live) {
    return (<div className="text-center"><Loading /></div>);
  }

  if (iOSWeChat) {
    return (<div className="container text-center">
      <div style={{width:'240px', margin:'20px auto 20px auto'}}>
        因微信内置浏览器不支持WebRCT，需要使用手机自带浏览器观看直播，操作方法如下图。
      </div>
      <div>
        <img style={{borderRadius:'8px'}} src="/share-to-safari.png" width="200" />
      </div>
    </div>)
  }

  if (androidWeChat) {
    return (<div className="container text-center">
      <div style={{width:'240px', margin:'20px auto 20px auto'}}>
        因微信内置浏览器不支持WebRCT，需要下载小度鱼APP，才能观看直播
        <div>
          <a href="/app/xiaoduyu/"className="btn btn-primary mt-3">下载APP，观看直播</a>
        </div>
      </div>
    </div>)
  }

  if (!supportWebRTC) {
    return (<div className="container">
      <div><a href="/app/xiaoduyu">你的浏览器不支持WebRTC，请使用Chrome或Safari浏览器，请下载APP观看直播</a></div>
    </div>)
  }

  return (<div styleName="container" ref={containerRef}>
    <Meta title={live.user_id.nickname+'直播间：'+live.title} />

    <div styleName="left">
    <div className="card rounded-left mb-0">

      <div className="card-header p-0 d-flex justify-content-between">
        <div className="d-flex flex-row align-items-center">
          <img styleName="avatar" src={live.user_id.avatar_url} />
          <div>
            <div><b>{live.user_id.nickname}</b></div>
            <div>{live.title}</div>
            <ActiveInfo {...live} />
          </div>
        </div>
        <div className="pt-4 pr-3">
          <Share live={live} />
        </div>
      </div>

      <div className="card-body p-0" styleName="live-container" id="video">

        {live.status ?
          <span
            styleName='play'
            onClick={()=>{
              playControl();
              setShowRoom(true);
            }}
            >
            <svg
              width="28"
              height="28"
              // fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <use xlinkHref="/feather-sprite.svg#play" />
            </svg>
          </span>
          :
          <div styleName="notice-box">
            <h5>直播预告</h5>
            <div>{live.notice}</div>
          </div>
          }

      </div>

    </div>
    </div>

    <div styleName='right'>
      <div className="card rounded-right border-left">
        <div className="card-body p-0">
          {live.status && showRoom ?
          <TalkRoom liveId={live._id} />
          : null}
        </div>
      </div>
    </div>


  </div>)
})