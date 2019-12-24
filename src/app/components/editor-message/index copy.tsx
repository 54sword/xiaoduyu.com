import React, { useState, useEffect } from 'react';

// common
import storage from '@app/common/storage';

// reudx
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
      $.toast({
        text: err.message,
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'error',
        loader: false,
        allowToastClose: false
      });
    }

  }

  const syncContent = async function(contentJSON: string, contentHTML: string) {

    setContentJSON(contentJSON);
    setContentHTML(contentHTML);

    if (!showFooter && contentJSON) {
      setShowFooter(true);
    }

    let commentsDraft = await storage.load({ key: 'comments-draft' });
    
    // 只保留最新的10条草稿
    // let index = []
    // for (let i in commentsDraft) index.push(i)
    // if (index.length > 10) delete commentsDraft[index[0]]

    commentsDraft[addressee_id] = contentJSON

    storage.save({
      key: 'comments-draft',
      data: commentsDraft
    });
  }

  const componentsDidMount = async function() {

    // 从缓存中获取，评论草稿
    let commentsDraft: any = {};
    
    try {
      commentsDraft = await storage.load({ key: 'comments-draft' }) || {};
    } catch (err) {
      commentsDraft = {}
      console.log(err);
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
  }

  useEffect(()=>{
    componentsDidMount();
  }, []);

  return (<div styleName="box">
      <div styleName="content">{content}</div>
      {showFooter ?
        <div styleName="footer">
          <button onClick={submit} type="button" className="btn btn-primary rounded-pill btn-sm pl-3 pr-3">{submitting ? '提交中...' : '提交'}</button>
        </div>
        : null}
    </div>)

}