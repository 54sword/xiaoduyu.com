import React, { useEffect } from 'react';
import { getCountdown } from '@utils/date';

import { useSelector, useStore } from 'react-redux';
import { loadADlist } from '@actions/ad';
import { getADListById } from '@reducers/ad';
import { getUserInfo } from '@reducers/user';
import { authorAD } from '@config/feature.config';

import './index.scss';

interface Props {
  _id: string,
  userId: string
}

export default function({ _id = '', userId }: Props) {

  if (!authorAD) return null;

  const me = useSelector((store: any)=>getUserInfo(store));
  const adList = useSelector((store: any)=>getADListById(store, _id));
  const store = useStore();
  const load = (params: any) => loadADlist(params)(store.dispatch, store.getState);

  let ad;

  if (adList && adList.data && adList.data[0]) {
    ad = adList.data[0];
  }

  const componentDidMount = () => {
    if (!adList && _id) {
      load({
        id: _id,
        args: { _id }
      })
    } 
  }

  useEffect(()=>{
    componentDidMount();
  }, []);

  if (me && me._id == userId) {

    // 删除
    if (ad && ad.deleted) {
      return (<div styleName="box">因违反用户协议，广告已被删除</div>)
    }
    
    // 屏蔽
    if (me.ad && ad && new Date(ad.block_date).getTime() > new Date().getTime()) {
  
      let dataArr = getCountdown(new Date().getTime(),  new Date(ad.block_date).getTime());
  
      let _date = [];
  
      if (dataArr.days) _date.push(dataArr.days+'天')
      if (dataArr.hours) _date.push(dataArr.hours+'小时')
      if (dataArr.mintues) _date.push(dataArr.mintues+'分钟')
  
      return (<div styleName="box">
          因违反用户协议，广告已被屏蔽（{_date.join('')}后接触）
        </div>)
    }
    
    if (!me.ad && me._id == userId ) {
      return (<div>
        <div styleName="box">
          <div styleName="title">{me.nickname} 你好！</div>
          <div>感谢你参与社区互动，此处可以<b styleName="green">免费</b>添加属于你的广告，如：个人作品、博客、App等。</div>
          <div><button className="btn btn-success btn-sm mt-2" data-toggle="modal" data-target="#ad-settings">添加广告</button></div>
        </div>
      </div>)
    }

  }
  
  if (!ad || !ad.pc_url || !ad.pc_img || ad.deleted || new Date(ad.block_date).getTime() > new Date().getTime()) return null;

  if (!_id) return null;

  return (<div>

    {me && me.ad && me.ad == _id ? 
      <a href="javascript:void(0)" data-toggle="modal" data-target="#ad-settings" styleName="plan">编辑</a> :
      <a href="javascript:void(0)" styleName="plan">广告</a>}
    
    <a
      styleName="ad"
      href={ad.pc_url}
      target="_blank"
      style={{backgroundImage:"url("+ad.pc_img+")"}}
      >
    </a>

  </div>)
}
