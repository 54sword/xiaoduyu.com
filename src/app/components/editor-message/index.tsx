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

export default function({ addressee_id = '', placeholder = '写消息...'}: Props) {

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
        
      let [ err, res ] = await _addMessage({
          addressee_id: addressee_id,
          type: 1,
          content_html: contentHTML,
          device: Device.getCurrentDeviceId()
        });

      if (!err) {
        console.log(controller);
        onChange('');
        controller.clear();
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

  const onChange = async function(contentHTML: string) {

    setContentHTML(contentHTML);

    let commentsDraft = await storage.load({ key: 'comment-draft' }) || {};
    
    if (!commentsDraft || typeof commentsDraft != 'object') commentsDraft = {};
    
    commentsDraft[addressee_id] = contentHTML;
    
    storage.save({ key: 'comment-draft', data: commentsDraft });
  }

  let getEditorController = async function(controller: any) {
    let editComment =  '';

    // 从缓存中获取，评论草稿
    let commentsDraft: any = {};
    
    try {
      commentsDraft = await storage.load({ key: 'comment-draft' }) || {};
    } catch (err) {
      commentsDraft = {}
    }

    controller.insert(editComment || commentsDraft[addressee_id] || '')

    setContentHTML(editComment || commentsDraft[addressee_id] || '');

    setController(controller);
  }

  return (<div>
    <div styleName="content">
      <Editor
        onChange={onChange}
        onSubmit={submit}
        placeholder={placeholder}
        getEditorController={getEditorController}
        />
    </div>
  </div>)
  
}