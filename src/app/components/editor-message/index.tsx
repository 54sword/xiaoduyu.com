import React, { useState, useEffect, useRef } from 'react';

// common
import storage from '@app/common/storage';

// redux
import { useStore } from 'react-redux';
import { addMessage } from '@app/redux/actions/message';

// tools
import Device from '@app/common/device';

// components
import Editor from '@app/components/editor';

// styles
import './styles/index.scss';

interface Props {
  addressee_id: string,
  placeholder: string
}

export default function({
  addressee_id = '',
  placeholder = '写评论...'
}: Props) {

  const [ controller, setController ] = useState(null);
  const [ contentHTML, setContentHTML ] = useState('');

  const store = useStore();
  const _addMessage = (args: object) => addMessage(args)(store.dispatch, store.getState);

  const submit = async function() {
    return new Promise(async (resolve)=>{

    let html = decodeURIComponent(contentHTML);
    
    html = html.replace(/<img(.*)>/g,"1");
    html = html.replace(/<[^>]+>/g,"");
    html = html.replace(/(^\s*)|(\s*$)/g, "");

    if (!html) {
      controller.focus();
      resolve();
      return;
    }

    /*
    // 判断是否为空
    let str = html.replace(/\s/ig,'');
        html = html.replace(/<[^>]+>/g, '');
        html = html.replace(/\r\n/g, ''); 
        html = html.replace(/\n/g, '');
        str = html.replace(/\&nbsp\;/ig,'');

    if (!str) {
      controller.focus();
      resolve();
      return;
    }

    if (html.indexOf('<img src="">') != -1) {
      $.toast({
        text: '有图片上传中，请等待上传完成后再提交',
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'warning',
        loader: false,
        allowToastClose: false
      });
      return;
    }
    */

      
    let [ err, res ] = await _addMessage({
        addressee_id: addressee_id,
        type: 1,
        content_html: contentHTML,
        device: Device.getCurrentDeviceId()
      });

    if (!err) {
      syncContent('');
      controller.clearContent();
    } else if (err) {

      $.toast({
        text: err.message,
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'error',
        loader: false,
        allowToastClose: false
      });
      
    }

    resolve()

    })
  }

  const syncContent = async function(contentHTML: string) {

    setContentHTML(contentHTML);

    let commentsDraft = await storage.load({ key: 'comment-draft' }) || {};
    
    if (!commentsDraft || typeof commentsDraft != 'object') commentsDraft = {};
    
    commentsDraft[addressee_id] = contentHTML;
    
    storage.save({ key: 'comment-draft', data: commentsDraft });
  }

  let onEditorLoad = async function(controller: any) {
    let editComment =  '';

    // 从缓存中获取，评论草稿
    let commentsDraft: any = {};
    
    try {
      commentsDraft = await storage.load({ key: 'comment-draft' }) || {};
    } catch (err) {
      commentsDraft = {}
    }

    controller.innterHTML(editComment || commentsDraft[addressee_id] || '')

    setContentHTML(editComment || commentsDraft[addressee_id] || '');

    setController(controller);
  }

  return (
    <div styleName="content">
      <Editor
        onChange={syncContent}
        onSubmit={submit}
        placeholder={placeholder}
        onLoad={onEditorLoad}
        />
    </div>
  )
  
}