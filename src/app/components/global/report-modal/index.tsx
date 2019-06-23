import React, { useState, useEffect, createRef } from 'react';
import Modal from '@components/bootstrap/modal';

// redux
import { useSelector, useStore } from 'react-redux';
import { getReportTypes } from '@reducers/report-types';
import { loadReportTypes, addReport } from '@actions/report';

// style
import './style.scss';

export default function() {

  const detail = createRef();

  const [ submitting, setSubmitting ] = useState(false);
  const [ posts, setPosts ] = useState(null);
  const [ comment, setComment ] = useState(null);
  const [ user, setUser ] = useState(null);
  const [ type, setType ] = useState(0);

  const types = useSelector((state: object)=>getReportTypes(state));
  const store = useStore();

  const _loadReportTypes = ()=>loadReportTypes()(store.dispatch, store.getState);
  const _addReport = (args:object)=>addReport(args)(store.dispatch, store.getState);

  useEffect(()=>{

    $(`#report`).on('show.bs.modal',  async (e: any) => {

      if (!types) await _loadReportTypes();

      const { posts, comment, user } = e.relatedTarget;

      setPosts(posts);
      setComment(comment);
      setUser(user);

    });

  });

  const chooseType = function(type:any) {
    setType(type.id);
  }

  const submit = async function() {

    const $detail = detail.current;

    if (!type) {

      Toastify({
        text: '请选择举报类型',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      return

    }

    let data: any = {
      report_id: type
    };

    if ($detail.value) data.detail = $detail.value;

    if (posts) {
      data.posts_id = posts._id;
    } else if (comment) {
      data.comment_id = comment._id;
    } else if (user) {
      data.people_id = user._id;
    } else {
      Toastify({
        text: '举报目标不存在',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      return
    }

    setSubmitting(true);

    let [ err, res ] = await _addReport({ data });

    setSubmitting(false);

    if (err) {

      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    } else {

      Toastify({
        text: '提交成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();

      $(`#report`).modal('hide');

      // 清空内容
      $('#report input:radio').each((index:number, dom:any)=>{
        dom.checked = false;
      });
      $detail.value = '';

    }

  }

  let title = '';

  if (posts) {
    title = (<div>我要举报 <b>{posts.user_id.nickname}</b> 的帖子<div>{posts.title}</div></div>);
  } else if (comment) {
    title = (<div>我要举报 <b>{comment.user_id.nickname}</b> 的{comment.parent_id ? '回复' : '评论'}<div>{comment.content_summary}</div></div>);
  } else if (user) {
    title = (<div>我要举报 <b>{user.nickname}</b> 用户</div>);
  }

  return (<div>
    <Modal id="report" title={'举报'} body={<div styleName="box">

        <div styleName="report-content">{title}</div>
        <div styleName="types">
          {types && types.map((item: any)=>{
            return (<label key={item.id}><input type="radio" name="report" onClick={()=>chooseType(item)} />{item.text}</label>)
          })}
        </div>
        <div styleName="detail">
          <textarea placeholder="补充举报说明" className="border" ref={detail}></textarea>
        </div>
        <div>
          <button onClick={submit} type="button" className="btn btn-primary">{submitting ? '提交中...' : '提交'}</button>
        </div>
      </div>} />
  </div>)

}
