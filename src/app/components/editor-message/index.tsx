import React, { useState, useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

// reudx
import { useStore } from 'react-redux';
import { addMessage } from '@actions/message';

// tools
import Device from '@utils/device';

// components
import Editor from '@components/editor';

// styles
import './style.scss';

interface Props {
  addressee_id: string,
  placeholder: string,
  successCallback: ()=>void
  getEditor: (s: object)=>void
}

export default function({
  addressee_id,
  placeholder = '请输入...',
  successCallback = ()=>{},
  getEditor = (s)=>{}
}: Props) {

  const [ contentJSON, setContentJSON ] = useState('');
  const [ contentHTML, setContentHTML ] = useState('');
  const [ content, setContent ] = useState(<div></div>,);
  const [ editor, setEditor ] = useState(null);
  const [ showFooter, setShowFooter ] = useState(false);
  const [ submitting, setSubmitting ] = useState(false);

  const store = useStore();
  const _addMessage = (args: object) => addMessage(args)(store.dispatch, store.getState);

  const submit = async function() {

    if (submitting) return
    if (!contentJSON) return editor.focus()

    if (contentHTML.indexOf('<img src="">') != -1) {
      Toastify({
        text: '有图片上传中，请等待上传完成后再提交',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #0988fe, #1c75fb)'
      }).showToast();
      return;
    }

    setSubmitting(true);

    let [ err, res ] = await _addMessage({
      addressee_id: addressee_id,
      type: 1,
      content: contentJSON,
      content_html: contentHTML,
      device: Device.getCurrentDeviceId()
    });

    setSubmitting(false);

    if (!err) {

      setContent(<div key={new Date().getTime()}>
      <Editor
        syncContent={syncContent}
        content={''}
        getEditor={(editor: any)=>{
          setEditor(editor);
          // self.setState({ editor })
          getEditor(editor)
        }}
        displayControls={true}
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

    if (!showFooter && contentJSON) {
      setShowFooter(true);
    }

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
      commentsDraft[addressee_id] = contentJSON
      reactLocalStorage.set('comments-draft', JSON.stringify(commentsDraft))
    // }

  }

  useEffect(()=>{

    // 从缓存中获取，评论草稿
    let commentsDraft = reactLocalStorage.get('comments-draft') || '{}';

    try {
      commentsDraft = JSON.parse(commentsDraft) || {}
    } catch (e) {
      commentsDraft = {}
    }

    let params = {
      content: commentsDraft[addressee_id] || '',
      syncContent: syncContent,
      getEditor:(editor: object)=>{
        setEditor(editor);
        getEditor(editor);
      },
      displayControls: true,
      placeholder
      // getCheckUpload: (checkUpload) =>{
      //   self.checkUpload = checkUpload;
      // }
    }

    setContent(<Editor {...params} />)

  }, []);

  return (<div styleName="box">
      <div styleName="content">{content}</div>
      {showFooter ?
        <div styleName="footer">
          <button onClick={submit} type="button" className="btn btn-primary">{submitting ? '提交中...' : '提交'}</button>
        </div>
        : null}
    </div>)

}