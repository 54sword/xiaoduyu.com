import React, { useState, useEffect, useRef } from 'react';
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

// styles
import './styles/index.scss';

interface Props {
  // 创建成功，编辑成功回调方法
  successCallback: ({ _id }: any) => void,
  // 如果传入posts表示编辑posts
  posts?: {
    _id: string,
    // 话题
    topic_id: {
      _id: string,
      name: string
    },
    // 标题
    title: string,
    // 正文原始格式
    content?: string,
    // 正文的html
    content_html?: string
    // 正文是否是markdown
    markdown?: boolean
  }
}

let editorController: any;

export default function ({ posts, successCallback = () => { } }: Props) {

  const { _id, title, content, content_html, topic_id, markdown } = posts || {};

  const { location } = useReactRouter();
  const titleRef = useRef();

  const [contentHTML, setContent] = useState(content || content_html || '');
  const [topic, setTopic] = useState(topic_id || null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState(markdown ? 'markdown' : 'rich');

  const topicList = useSelector((state: object) => getTopicListById(state, 'editor-topics'));
  const store = useStore();
  const _addPosts = (args: any) => addPosts(args)(store.dispatch, store.getState);
  const _loadTopicList = (args: any) => loadTopicList(args)(store.dispatch, store.getState);
  const _updatePosts = (args: any) => updatePosts(args)(store.dispatch, store.getState);

  // 标题发生变化
  const onTitleChange = function () {
    if (_id) return;
    storage.save({ key: 'posts-title', data: titleRef.current.value })
  }

  // 话题发生变化
  const onSelectTopic = function (data: any) {
    setTopic(data);
    $('#topics-modal').modal('hide');
  }

  // 内容发生变化
  const onContentChange = function (contentHTML: string) {
    setContent(contentHTML);
    if (_id) return;
    storage.save({ key: 'posts-content', data: contentHTML })
  }

  // 提交/创建与更新
  const submit = function () {
    return new Promise(async (resolve) => {

      const title = titleRef.current;

      if (!title.value) {
        resolve();
        return title.focus();
      }

      if (!topic) {
        resolve();

        // $.toast({
        //   text: '请选择一个与帖子相关的话题',
        //   position: 'top-center',
        //   showHideTransition: 'slide',
        //   icon: 'info',
        //   loader: false,
        //   allowToastClose: false,
        // });

        $('#topics-modal').modal({
          show: true
        }, {});

        return;
        // return alert('请选择一个与帖子相关的话题');
      }

      let err: any, res: any;

      if (_id) {

        // 更新
        let result: any = await To(_updatePosts({
          id: _id,
          topicId: topic._id,
          title: title.value,
          content: contentHTML
        }));

        [err, res] = result;

        if (err) {

          $.toast({
            text: err.message || '提交失败，请重新尝试',
            position: 'top-center',
            showHideTransition: 'slide',
            icon: 'error',
            loader: false,
            allowToastClose: false,
          });

          resolve();

        } else {
          successCallback({ _id });
        }

        return;
      }

      // 新增
      let result: any = await _addPosts({
        title: title.value,
        content: contentHTML,
        topicId: topic._id,
        device: Device.getCurrentDeviceId(),
        type: 1,
        markdown: mode == 'markdown'
      });

      [err, res] = result;

      if (res && res.success) {
        setTimeout(() => {
          storage.save({ key: 'posts-title', data: '' });
          storage.save({ key: 'posts-content', data: '' });
        }, 200);

        setTimeout(() => {

          successCallback(res);

          $.toast({
            text: '提交成功',
            position: 'top-center',
            showHideTransition: 'slide',
            icon: 'success',
            loader: false,
            allowToastClose: false
          });

        }, 1500);
      } else {

        $.toast({
          text: err.message,
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'error',
          loader: false,
          allowToastClose: false
        });

        // 绑定手机号
        if (err &&
          err.extensions &&
          err.extensions.code &&
          err.extensions.code == "BIND_PHONE"
        ) {
          setTimeout(() => {
            $('#binding-phone').modal({
              show: true
            }, {});
          }, 3000);
        }

        resolve();
      }

    })
  }

  const onMount = async () => {

    // 如果没有话题的话，加载话题
    if (!topicList) {
      await _loadTopicList({
        id: 'editor-topics',
        args: {
          sort_by: 'sort:-1',
          parent_id: 'not-exists',
          page_size: 1000
        }
      })
    }

    // 初始化标题、内容、编辑器模式
    let _content = '', _title = '', _mode = 'rich';

    if (_id) {
      _title = title || '';
      _content = contentHTML;
      _mode = markdown ? 'markdown' : 'rich';
    } else {
      // 从本地数据库中获取草稿
      _title = await storage.load({ key: 'posts-title' }) || '';
      _content = await storage.load({ key: 'posts-content' }) || '';
      _mode = await storage.load({ key: 'editor-mode' }) || 'rich';
      if (mode != 'rich' && mode != 'markdown') _mode = 'rich';

      // 如果url中有topic_id，那么设置它为默认topic
      const list = getTopicListById(store.getState(), 'editor-topics');
      const { topic_id } = location.params;
      if (topic_id && !topic && list && list.data && list.data[0]) {
        list.data.map((item: any) => {
          item.children.map((item: any) => {
            if (item._id == topic_id) setTopic(item)
          })
        });
      }

    }

    titleRef.current.value = _title;
    setContent(_content);
    setMode(_mode);
    setReady(true);
  }

  const onModeChange = (mode: string) => {
    if (mode == 'rich' || mode == 'markdown') {
      storage.save({ key: 'editor-mode', data: mode });
      editorController.clear();
      storage.save({ key: 'posts-content', data: '' });
      setMode(mode);
    }
  }

  useEffect(() => {
    onMount();
  }, []);
  
  return (<div>

    <Modal
      id="topics-modal"
      header={<div className="text-success"><b>请选择一个与帖子主题相关的话题</b></div>}
      body={<div styleName='topics-container'>
        {topicList && topicList.data.map((item: any) => {
          return (<div key={item._id}>
            <div className="text-secondary mt-3">{item.name}</div>
            <div>
              {item.children && item.children.map((item: any) => {
                return (<div
                  key={item._id}
                  styleName={topic && topic._id == item._id ? 'active' : 'topic'}
                  onClick={() => { onSelectTopic(item) }}>
                  {item.name}
                </div>)
              })}
            </div>
          </div>)
        })}
      </div>}
    />

    <div styleName="title-bar">
      <div className="row">
        <div className="col-3 col-md-2 pr-0">
          <span
            styleName="choose-topic-button"
            className="a card border-right rounded-left border-0"
            data-toggle="modal"
            data-target="#topics-modal"
          >
            {topic ? topic.name : '选择话题'}
          </span>
        </div>
        <div className="col-9 col-md-10 pl-0">
          <input className="card rounded-right" styleName="title" ref={titleRef} type="text" onChange={onTitleChange} placeholder="请输入标题" />
        </div>
      </div>
    </div>

    <div className="card">
      {ready ?
        <Editor
          onSubmit={submit}
          placeholder={'(可选) 正文'}
          editorStyle={{
            minHeight: 300
          }}
          onChange={onContentChange}
          displayMode={_id ? false : true}
          markdown={mode == 'markdown'}
          onModeChange={onModeChange}
          getEditorController={(e: any) => editorController = e}
          onInit={() => {
            if (contentHTML) {
              editorController.insert(contentHTML);
            }
          }}
        />
        : null}
    </div>

  </div>)

}