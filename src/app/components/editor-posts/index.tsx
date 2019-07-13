import React, { useState, useEffect, useRef } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import useReactRouter from 'use-react-router';

// redux
import { useSelector, useStore } from 'react-redux';
import { addPosts, updatePosts } from '@actions/posts';
import { loadTopicList } from '@actions/topic';
import { getTopicListById } from '@reducers/topic';

// components
import Device from '@utils/device';
import To from '@utils/to';
import Editor from '@components/editor';
import Modal from '@components/bootstrap/modal';
import HTMLText from '@components/html-text';

// styles
import './style.scss';

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
  const _addPosts = (args:object)=>addPosts(args)(store.dispatch, store.getState);
  const _loadTopicList = (args:object)=>loadTopicList(args)(store.dispatch, store.getState);
  const _updatePosts = (args:object)=>updatePosts(args)(store.dispatch, store.getState);
  
  // 标题发生变化
  const onTitleChange = function() {
    if (_id) return;
    reactLocalStorage.set('posts-title', titleRef.current.value)
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
    reactLocalStorage.set('posts-content', contentStateJSON)
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

    if (_id) {
      // 更新
      let [ err, res ] = await To(_updatePosts({
        id: _id,
        // type: type._id,
        topicId: topic._id,
        topicName: topic.name,
        title: title.value,
        detail: contentStateJSON,
        detailHTML: contentHTML,
      }));

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

    let [err, res] = await _addPosts({
      title: title.value,
      detail: contentStateJSON,
      detailHTML: contentHTML,
      topicId: topic._id,
      device: Device.getCurrentDeviceId(),
      type: 1
    });

    if (res && res.success) {
      setTimeout(()=>{
        reactLocalStorage.set('posts-content', '');
        reactLocalStorage.set('posts-title', '');
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

  useEffect(()=>{

    

    // 如果没有话题的话，加载话题
    if (!topicList) {
      _loadTopicList({
        id: 'new-posts',
        args: {
          sort_by: 'sort:-1',
          parent_id: 'not-exists',
          page_size: 1000
        }
        // filters: {
        //   variables: {
        //     sort_by: 'sort:-1',
        //     parent_id: 'not-exists',
        //     page_size: 1000
        //   }
        // }
      }).then(([err, res]: any)=>{

        const topicList = getTopicListById(store.getState(), 'new-posts').data;
        const { topic_id } = location.params;

        // 如果url中有topic，那么设置它为默认topic
        if (topic_id && !topic && topicList && topicList.data && topicList.data[0]) {
          topicList.data.map((item: any)=>{
            item.children.map((item: any)=>{
              if (item._id == topic_id) setTopic(item)
            })
          });
        }

      })
    }

    const _content = _id ? contentStateJSON : (reactLocalStorage.get('posts-content') || ''),
    _title = _id ? props.title : (reactLocalStorage.get('posts-title') || '');

    let mount = true;

    setEditor(<div>
      <Editor
        syncContent={(json: string, html: string)=>{
          if (!mount) return;
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

    return () => {
      mount = false;
    }

  }, []);

  return (<div>

    <Modal
      id="topics-modal"
      header="请选择一个话题"
      body={<div styleName='topics-container'>
          {topicList && topicList.data.map((item: any)=>{
          return (<div key={item._id}>
              <div styleName='head' className="text-secondary">{item.name}</div>
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

    <div className="row">
      <div className="col-md-2">
        <a
          styleName="choose-topic-button"
          className="card"
          href="javascript:void(0)"
          data-toggle="modal" 
          data-target="#topics-modal"
          >
          {topic ? topic.name : '选择话题'}
        </a>
      </div>
      <div className="col-md-10 pl-md-0 pl-lg-0 pl-xl-0">
        <input className="card" styleName="title" ref={titleRef} type="text" onChange={onTitleChange} placeholder="请输入标题"  />
      </div>
    </div>
    <div styleName="editor" className="card">{editor}</div>
    
    <div className="card">
      <div className="d-flex justify-content-between p-2">
        <div>
          <button type="button" className="btn btn-link" onClick={()=>setPreview(preview ? false : true)}>{preview ? '关闭' : ''}预览</button>
        </div>
        <div>
          <button className="btn btn-block btn-primary" onClick={submit}>{loading ? '发布中...' : '发布'}</button>
        </div>
      </div>
    </div>
    
    {preview ?
      <div className="card">
          <div className="card-body">
          <HTMLText content={decodeURIComponent(contentHTML)} />
          </div>
      </div>  
      : null}

  </div>)

}