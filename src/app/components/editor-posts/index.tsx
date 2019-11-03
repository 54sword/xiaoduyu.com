import React, { useState, useEffect, useRef } from 'react';
// import { reactLocalStorage } from 'reactjs-localstorage';
import useReactRouter from 'use-react-router';

// common
import storage from '@app/common/storage';

// redux
import { useSelector, useStore } from 'react-redux';
import { addPosts, updatePosts } from '@app/redux/actions/posts';
import { loadTopicList } from '@app/redux/actions/topic';
import { getTopicListById } from '@app/redux/reducers/topic';

// components
import Device from '@app/common/device';
import To from '@app/common/to';
import Editor from '@app/components/editor';
import Modal from '@app/components/bootstrap/modal';
import HTMLText from '@app/components/html-text';

// styles
import './styles/index.scss';

type successCallback = {
  // 返回posts _id
  _id: string
}

interface Props {
  // 创建成功，编辑成功回调方法
  successCallback: (s: successCallback) => void,

  // 编辑需要传入
  topic_id?: {
    _id: string,
    name: string
  },
  _id?: string,
  title?: string,
  content?: string,
  content_html?: string
}

export default function(props: Props) {

  const { _id, successCallback } = props;

  const { location } = useReactRouter();

  const titleRef = useRef();
  
  // const [ mount, setMount ] = useState(true);
  const [ contentStateJSON, setContentStateJSON ] = useState(props.content || '');
  const [ contentHTML, setContentHTML ] = useState(props.content_html || '');
  const [ topic, setTopic ] = useState(props.topic_id || null);
  const [ editor, setEditor ] = useState(<div></div>);
  const [ loading, setLoading ] = useState(false);
  const [ editorElement, setEditorElement ] = useState(null);
  const [ preview, setPreview ] = useState(false);

  // redux
  const topicList = useSelector((state: object)=>getTopicListById(state, 'new-posts'));
  const store = useStore();
  const _addPosts = (args:any)=>addPosts(args)(store.dispatch, store.getState);
  const _loadTopicList = (args:any)=>loadTopicList(args)(store.dispatch, store.getState);
  const _updatePosts = (args:any)=>updatePosts(args)(store.dispatch, store.getState);
  
  // 标题发生变化
  const onTitleChange = function() {
    if (_id) return;
    storage.save({ key: 'posts-title', data: titleRef.current.value })
  }

  // 话题发生变化
  const onSelectTopic = function(topic: any) {
    setTopic(topic);
    $('#topics-modal').modal('hide');
  }

  // 内容发生变化
  const onContentChange = function(contentStateJSON: string, contentHTML: string) {

    // console.log(contentHTML);

    setContentStateJSON(contentStateJSON);
    setContentHTML(contentHTML);
    if (_id) return;
    storage.save({ key: 'posts-content', data: contentStateJSON })
  }

  // 提交/创建与更新
  const submit = async function() {

    const title = titleRef.current;

    if (loading) return;
    if (!topic) return alert('您还未选择话题');
    if (!title.value) return title.focus();

    /*
    let str = contentHTML.replace(/\s/ig,'')
        str = str.replace(/<[^>]+>/g,"");

        if (str.length == 0) {
          editorElement.focus();
          return;
          // alert('文章正文内容不能少于300字')
        }
    */

    // 内容中如果包含，为上传的图片
    if (contentHTML.indexOf('<img src="">') != -1) {
      Toastify({
        text: '有图片上传中，请等待上传完成后再提交',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #0988fe, #1c75fb)'
      }).showToast();
      return;
    }

    setLoading(true);

    let err: any, res: any;

    if (_id) {
      // 更新
      let result: any = await To(_updatePosts({
        id: _id,
        // type: type._id,
        topicId: topic._id,
        topicName: topic.name,
        title: title.value,
        detail: contentStateJSON,
        detailHTML: contentHTML,
      }));

      [ err, res ] = result;

      setLoading(false);

      if (err) {
        Toastify({
          text: err.message || '提交失败，请重新尝试',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
      } else {
        successCallback({ _id });
      }

      return;
    }

    // 添加
    
    let result: any = await _addPosts({
      title: title.value,
      detail: contentStateJSON,
      detailHTML: contentHTML,
      topicId: topic._id,
      device: Device.getCurrentDeviceId(),
      type: 1
    });

    [err, res] = result;

    if (res && res.success) {
      setTimeout(()=>{
        storage.save({ key: 'posts-title', data: '' });
        storage.save({ key: 'posts-content', data: '' });
      }, 200);

      setTimeout(()=>{
        setLoading(false);
        successCallback(res);

        Toastify({
          text: '提交成功',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
        }).showToast();

      }, 1500);
    } else {

      setLoading(false);

      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    }

  }

  const start = async() => {

    // 如果没有话题的话，加载话题
    if (!topicList) {
      await _loadTopicList({
        id: 'new-posts',
        args: {
          sort_by: 'sort:-1',
          parent_id: 'not-exists',
          page_size: 1000
        }
      })
    }

    const list = getTopicListById(store.getState(), 'new-posts');
    const { topic_id } = location.params;

    // 如果url中有topic，那么设置它为默认topic
    if (topic_id && !topic && list && list.data && list.data[0]) {
      list.data.map((item: any)=>{
        item.children.map((item: any)=>{
          if (item._id == topic_id) setTopic(item)
        })
      });
    }

    let _content = '', _title = '';
    
    if (_id) {
      _content = contentStateJSON;
    } else {
      _content = await storage.load({ key: 'posts-content' }) || ''
    }

    if (_id) {
      _title = props.title || '';
    } else {
      _title = await storage.load({ key: 'posts-title' }) || ''
    }

    // _id ? contentStateJSON : await storage.load({ key: 'posts-content' }) || '';
          // _title = _id ? props.title : await storage.load({ key: 'posts-title' }) || '';
    
    // const _content = _id ? contentStateJSON : (reactLocalStorage.get('posts-content') || ''),
    // _title = _id ? props.title : (reactLocalStorage.get('posts-title') || '');


  // console.log(await storage.load({ key: 'posts-content' }));
  // console.log(_title)

    // let mount = true;

  
    setEditor(<div>
      <Editor
        syncContent={(json: string, html: string)=>{
          // if (!mount) return;
          onContentChange(json, html);
        }}
        content={_content}
        placeholder={'请输入正文'}
        expandControl={true}
        getEditor={(editor: object)=>{ setEditorElement(editor) }}
        showMarkdown={true}
      />
    </div>);

    titleRef.current.value = _title;
    

  }

  // const componentDidMount = async function() {

  // }

  useEffect(()=>{

    start();


    // return () => {
      // mount = false;
    // }

  }, []);

  return (<div>

    <Modal
      id="topics-modal"
      header="请选择一个话题"
      body={<div styleName='topics-container'>
          {topicList && topicList.data.map((item: any)=>{
          return (<div key={item._id}>
              <div className="text-secondary mt-3">{item.name}</div>
              <div>
              {item.children && item.children.map((item: any)=>{
                return (<div
                  key={item._id}
                  styleName={topic && topic._id == item._id ? 'active' : 'topic'}
                  onClick={()=>{onSelectTopic(item)}}>{item.name}
                  </div>)
              })}
              </div>
            </div>)
          })}
        </div>}
      />

    <div style={{overflow:'hidden'}}>
    <div className="row">
      <div className="col-md-2 col-3 pr-0">
        <span
          styleName="choose-topic-button"
          className="a card border-right rounded-left border-0"
          data-toggle="modal" 
          data-target="#topics-modal"
          >
          {topic ? topic.name : '选择话题'}
        </span>
      </div>
      <div className="col-md-10 col-9 pl-0">
        <input className="card rounded-right" styleName="title" ref={titleRef} type="text" onChange={onTitleChange} placeholder="请输入标题"  />
      </div>
    </div>
    </div>

    <div className="card">
      {editor}
      <div className="card-footer">
      <div className="d-flex justify-content-between">
        <div>
          <button type="button" className="btn btn-link btn-sm" onClick={()=>setPreview(preview ? false : true)}>{preview ? '关闭' : ''}预览</button>
        </div>
        <div>
          <button className="btn btn-block btn-primary rounded-pill btn-sm pl-3 pr-3" onClick={submit}>{loading ? '发布中...' : '发布'}</button>
        </div>
      </div>
      </div>
    </div>
    
    {/* <div className="card">
      <div className="d-flex justify-content-between p-2">
        <div>
          <button type="button" className="btn btn-link" onClick={()=>setPreview(preview ? false : true)}>{preview ? '关闭' : ''}预览</button>
        </div>
        <div>
          <button className="btn btn-block btn-primary rounded-pill" onClick={submit}>{loading ? '发布中...' : '发布'}</button>
        </div>
      </div>
    </div> */}
    
    {preview ?
      <div className="card mt-2">
          <div className="card-body">
          <HTMLText content={decodeURIComponent(contentHTML)} />
          </div>
      </div>  
      : null}

  </div>)

}