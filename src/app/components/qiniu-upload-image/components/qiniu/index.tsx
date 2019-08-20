import React, { useState, useEffect } from 'react';
import fetch from "node-fetch";

import config from '@config/index'

// style
import './styles/index.scss';

interface Props {
  token: string,
  text?: string,
  size?: number,
  accept?: string,
  multiple?: boolean,
  onUpload?: (file: any)=>any
}

export default function({
  token,
  text = '上传图片',
  size = 1024*1024*2,
  accept = '*',
  multiple = true,
  onUpload = (file)=>{}
}: Props) {

  const [ uploadUrl, setUploadUrl ] = useState(config.qiniu.uploadUrl.http);

  useEffect(()=>{
    if (window.location.protocol === 'https:') {
      setUploadUrl(config.qiniu.uploadUrl.https)
    }
  }, []);

  const upload = function(file: any) {

    if (!file || file.size === 0) return null;

    const key = file.preview.split('/').pop() + '.' + file.name.split('.').pop();

    return new Promise(resolve=>{

      // const input = document.querySelector('input[type="file"]');
      const data = new FormData();
      data.append('file', file);
      data.append('token', token);
      data.append('key', key);
      data.append('x:filename', file.name);
      data.append('x:size', file.size);

      fetch(uploadUrl, {
        method: 'POST',
        body: data
      })
      .then((data: any)=>{
        resolve(data)
      })
      .catch((error: any)=>{
        resolve(error)
      });

    });

  }

  const onChange = function(e: any) {

    e.preventDefault();

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    let maxFiles = multiple ? files.length : 1;

    let arr = [];

    for (var i = 0; i < maxFiles; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
      files[i].upload = ((file)=>{
        return () => upload(file)
      })(files[i]);

      arr.push(files[i]);
    }

    onUpload(arr);
  }

  return (<a href="javascript:void(0)" styleName="file">{text}<input type="file" accept={accept} multiple={multiple} onChange={onChange} /></a>)
}