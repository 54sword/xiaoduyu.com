import React, { useState, useEffect } from 'react';
import Qiniu from './components/qiniu';

import { useStore } from 'react-redux';
import { getQiNiuToken } from '@app/redux/actions/qiniu';

interface Props {
  // displayLoading: boolean,
  text?: string,
  multiple?: boolean,
  beforeUpload?: (s:object)=>void,
  upload?: (url: string, s:object)=>void,
  accept?: string
  // onDrop: (files:object)=>void,
  // onUpload: (file:object)=>void
}

export default function({
  // displayLoading = true,
  text = '上传图片',
  multiple = true,
  beforeUpload = ()=>{},
  upload = ()=>{},
  accept = "image/gif, image/jpeg, image/png"
  // onDrop = (files)=>{},
  // onUpload = (file)=>{}
}: Props) {

  const [ token, setToken ] = useState('');
  const [ url, setUrl ] = useState('');
  const store = useStore();
  const _getQiNiuToken = () => getQiNiuToken()(store.dispatch, store.getState);

  useEffect(()=>{

    if (token) return;

    _getQiNiuToken().then(([err, res]: any)=>{
      if (res) {
        setToken(res.token);
        setUrl(res.url);
      }
    });

  });

  const HandleOnUpload = function(files:any) {

    beforeUpload(files);

    files.map((item: any)=>{
      item.upload().then((res: any)=>{
        res.text().then((res: any)=>{
          res = JSON.parse(res);
          upload(url+'/'+res.key, item);
        });
      });
    });

  }

  if (!token) return (<span></span>)

  return (
    <Qiniu
      text={text}
      // onDrop={this.onDrop}
      // size={100}
      multiple={multiple}
      accept={accept}
      token={token}
      // uploadKey={this.state.uploadKey}
      // maxSize="1Mb"
      onUpload={HandleOnUpload} />
  )

}