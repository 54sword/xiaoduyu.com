import React, { useState, useEffect, useRef } from 'react';

// common
import storage from '@app/common/storage';

// redux
import { useStore } from 'react-redux';
import { addComment, updateComment, loadCommentList } from '@app/redux/actions/comment';

// tools
import Device from '@app/common/device';

// components
import Editor from '@app/components/editor';

// styles
import './styles/index.scss';

interface Props {
  _id: string,
  posts_id: string,
  parent_id: string,
  reply_id: string,
  placeholder: string,
  successCallback: ()=>void,
  getEditor: (editor: object)=>void,
  // 转发
  forward: boolean
}

export default function({
  _id = '',
  posts_id = '',
  parent_id = '',
  reply_id = '',
  placeholder = '写评论...',
  successCallback = ()=>{},
  getEditor = (editor)=>{},
  forward = false
}: Props) {

  const [ controller, setController ] = useState(null);
  const [ contentHTML, setContentHTML ] = useState('');
  // const [ submitting, setSubmitting ] = useState(false);

  const store = useStore();
  const _addComment = (args: object)=>addComment(args)(store.dispatch, store.getState);
  const _updateComment = (args: object)=>updateComment(args)(store.dispatch, store.getState);
  const _loadCommentList = (args: object)=>loadCommentList(args)(store.dispatch, store.getState);

  const submit = async function() {
    return new Promise(async (resolve)=>{

    let html = contentHTML;

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

    let err, res;

    if (_id) {
      [ err, res ] = await _updateComment({
        _id: _id,
        content_html: contentHTML
      });
    } else {
      
      [ err, res ] = await _addComment({
        posts_id: posts_id,
        parent_id: parent_id,
        reply_id: reply_id,
        contentHTML: contentHTML,
        deviceId: Device.getCurrentDeviceId()
      });
    }

    if (!err) {
      syncContent('');
      successCallback();
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

      if (err &&
         err.extensions &&
         err.extensions.code &&
         err.extensions.code == "BIND_PHONE"
      ) {
        setTimeout(()=>{
          $('#binding-phone').modal({
            show: true
          }, {});
        }, 3000);
      }

    }

    resolve()

    })
  }

  const syncContent = async function(contentHTML: string) {

    setContentHTML(contentHTML);

    let commentsDraft = await storage.load({ key: 'comment-draft' }) || {};
    
    if (!commentsDraft || typeof commentsDraft != 'object') commentsDraft = {};
    
    commentsDraft[reply_id || posts_id] = contentHTML;
    
    storage.save({ key: 'comment-draft', data: commentsDraft });
  }

  let onEditorLoad = async function(controller: any) {
    let editComment =  '';

    // console.log(_id);

    // 编辑评论
    if (_id) {
      let [ err, res ] = await _loadCommentList({
        name: 'edit_'+_id,
        args: { _id },
        fields: `
          content_html
          _id
          blocked
        `,
        restart: true
      });

      if (res && res.data && res.data[0]) {
        editComment = res.data[0].content_html;
      }

    }

    // 从缓存中获取，评论草稿
    let commentsDraft: any = {};
    
    try {
      commentsDraft = await storage.load({ key: 'comment-draft' }) || {};
    } catch (err) {
      commentsDraft = {}
    }

    controller.innterHTML(editComment || commentsDraft[reply_id || posts_id] || '')

    setContentHTML(editComment || commentsDraft[reply_id || posts_id] || '');

    setController(controller);
  }

  return (<div>
    <div styleName="content">
        <Editor
          onChange={syncContent}
          onSubmit={submit}
          placeholder={placeholder}
          onLoad={onEditorLoad}
          />
    </div>
    {/* <div styleName="footer" className="d-flex justify-content-between align-items-center">
      <div>
        {forward ?
          <label className="m-0">
            <input type="checkbox" ref={forwardRef} />
            <span className="ml-1" data-toggle="tooltip" data-placement="top" title="同时转发给我的粉丝">转发</span>
          </label>
          : null}
      </div>
      <div>
        <button onClick={submit} type="button" className="btn btn-block btn-primary rounded-pill btn-sm pl-3 pr-3">{submitting ? '提交中...' : '提交'}</button>
      </div>
    </div> */}
  </div>)
  
}