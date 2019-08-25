import React, { useState, useEffect, useRef } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

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

  const forwardRef = useRef();

  const [ contentJSON, setContentJSON ] = useState('');
  const [ contentHTML, setContentHTML ] = useState('');
  const [ content, setContent ] = useState(<div></div>);
  const [ editor, setEditor ] = useState(null);
  // const [ showFooter, setShowFooter ] = useState(false);
  const [ submitting, setSubmitting ] = useState(false);

  const store = useStore();
  const _addComment = (args: object)=>addComment(args)(store.dispatch, store.getState);
  const _updateComment = (args: object)=>updateComment(args)(store.dispatch, store.getState);
  const _loadCommentList = (args: object)=>loadCommentList(args)(store.dispatch, store.getState);

  const submit = async function() {

    if (submitting) return;
    if (!contentJSON) return editor.focus();

    let html = decodeURIComponent(contentHTML);

    // 判断是否为空
    let str = html.replace(/\s/ig,'');
        html = html.replace(/<[^>]+>/g, '');
        html = html.replace(/\r\n/g, ''); 
        html = html.replace(/\n/g, '');
        str = html.replace(/\&nbsp\;/ig,'');

    if (!str) {
      return editor.focus();
    }

    if (html.indexOf('<img src="">') != -1) {
      Toastify({
        text: '有图片上传中，请等待上传完成后再提交',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #0988fe, #1c75fb)'
      }).showToast();
      return;
    }

    setSubmitting(true);

    let err, res;

    if (_id) {
      [ err, res ] = await _updateComment({
        _id: _id,
        content: contentJSON,
        content_html: contentHTML
      });
    } else {
      
      [ err, res ] = await _addComment({
        posts_id: posts_id,
        parent_id: parent_id,
        reply_id: reply_id,
        contentJSON: contentJSON,
        contentHTML: contentHTML,
        deviceId: Device.getCurrentDeviceId(),
        forward: forwardRef && forwardRef.current ? forwardRef.current.checked : false
      });
    }

    setSubmitting(false);

    if (!err) {

      setContent(<div key={new Date().getTime()}>
      <Editor
        syncContent={syncContent}
        content={''}
        getEditor={(editor: object)=>{
          setEditor(editor);
          getEditor(editor)
        }}
        displayControls={parent_id ? false : true}
        />
      </div>);

      syncContent('', '');
      successCallback();
    } else if (err) {
      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    }

  }

  const syncContent = function(contentJSON: string, contentHTML: string) {

    setContentJSON(contentJSON);
    setContentHTML(contentHTML);

    // if (!showFooter && contentJSON) {
    //   setShowFooter(true);
    //   if (forward) $('[data-toggle="tooltip"]').tooltip();
    // }

    let commentsDraft = reactLocalStorage.get('comments-draft') || '{}'

    try {
      commentsDraft = JSON.parse(commentsDraft) || {}
    } catch (e) {
      commentsDraft = {}
    }

    // 只保留最新的10条草稿
    let index = []
    for (let i in commentsDraft) index.push(i)
    if (index.length > 10) delete commentsDraft[index[0]]

    // if (showFooter) {
      commentsDraft[reply_id || posts_id] = contentJSON;
      reactLocalStorage.set('comments-draft', JSON.stringify(commentsDraft))
    // }

  }

  let run = async function() {
    let editComment =  '';

    // 编辑评论
    if (_id) {
      let [ err, res ] = await _loadCommentList({
        name: 'edit_'+_id,
        args: { _id },
        fields: `
          content
          _id
        `,
        restart: true
      });

      if (res && res.data && res.data[0]) {
        editComment = res.data[0].content;
      }

    }

    // 从缓存中获取，评论草稿
    let commentsDraft = reactLocalStorage.get('comments-draft') || '{}';

    try {
      commentsDraft = JSON.parse(commentsDraft) || {}
    } catch (e) {
      commentsDraft = {}
    }

    let params = {
      content: editComment || commentsDraft[reply_id || posts_id] || '',
      syncContent: syncContent,
      getEditor:(editor: object)=>{
        setEditor(editor)
        getEditor(editor);
      },
      displayControls: true,
      placeholder
      // getCheckUpload: (checkUpload) =>{
      //   self.checkUpload = checkUpload;
      // }
    }

    setContent(<Editor {...params} />);
  }

  useEffect(()=>{
    run();
    if (forward) $('[data-toggle="tooltip"]').tooltip();
  }, []);

  return (<div styleName="box">
    <div styleName="content">{content}</div>
      <div styleName="footer" className="d-flex justify-content-between align-items-center">
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
      </div>
  </div>)
  
}