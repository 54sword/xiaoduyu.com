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
// import HTMLText from '@app/components/html-text';

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

  const [ contentHTML, setContentHTML ] = useState(props.content_html || '');
  const [ topic, setTopic ] = useState(props.topic_id || null);
  // const [ loading, setLoading ] = useState(false);
  const [ ready, setReady ] = useState(false);

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
  const onSelectTopic = function(data: any) {
    setTopic(data);
    $('#topics-modal').modal('hide');
  }

  // 内容发生变化
  const onContentChange = function(contentHTML: string) {
    setContentHTML(contentHTML);
    if (_id) return;
    storage.save({ key: 'posts-content', data: contentHTML })
  }

  // 提交/创建与更新
  const submit = function() {
    return new Promise(async (resolve)=>{

    const title = titleRef.current;

    // if (loading) return;
    if (!topic) {
      resolve();
      return alert('您还未选择话题');
    }
    if (!title.value) {
      resolve();
      return title.focus();
    }

    /*
    // 内容中如果包含，为上传的图片
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
    */
    
    // setLoading(true);

    let err: any, res: any;

    if (_id) {
      // 更新
      let result: any = await To(_updatePosts({
        id: _id,
        topicId: topic._id,
        // topicName: topic.name,
        title: title.value,
        contentHTML: contentHTML,
      }));

      [ err, res ] = result;

      // setLoading(false);

      if (err) {

        $.toast({
          text: err.message || '提交失败，请重新尝试',
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'error',
          loader: false,
          allowToastClose: false
        });

        resolve();

      } else {
        successCallback({ _id });
      }

      return;
    }

    // 添加
    
    let result: any = await _addPosts({
      title: title.value,
      contentHTML: contentHTML,
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
        
        // setLoading(false);
        successCallback(res);

        $.toast({
          text: '提交成功',
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'success',
          loader: false,
          allowToastClose: false
        });

        // resolve(true);

      }, 1500);
    } else {

      // setLoading(false);

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

      resolve();
    }

    

    })
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
      _content = contentHTML;//contentStateJSON;
    } else {
      _content = await storage.load({ key: 'posts-content' }) || '';
      setContentHTML(_content)
    }

    if (_id) {
      _title = props.title || '';
    } else {
      _title = await storage.load({ key: 'posts-title' }) || ''
    }

    titleRef.current.value = _title;

    setReady(true);
  }

  useEffect(()=>{
    start();
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
                  onClick={()=>{onSelectTopic(item)}}>
                    {item.name}
                  </div>)
              })}
              </div>
            </div>)
          })}
        </div>}
      />

    {/* <div style={{overflow:'hidden'}}> */}
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
    {/* </div> */}

    <div className="card">
      {/* {editor} */}
      
      {ready ?
        <Editor
          onSubmit={submit}
          placeholder={'(可选) 正文'}
          editorStyle={{
            minHeight: 300
          }}
          onChange={(html: string)=>{
            onContentChange(html);
          }}
          content={contentHTML}
          />
        : null}

    </div>

  </div>)

}