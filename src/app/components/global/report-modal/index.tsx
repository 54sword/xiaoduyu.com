import React, { useState, useEffect, createRef } from 'react';
import Modal from '@app/components/bootstrap/modal';

// redux
import { useSelector, useStore } from 'react-redux';
import { getReportTypes } from '@app/redux/reducers/report-types';
import { loadReportTypes, addReport } from '@app/redux/actions/report';

// style
import './styles/index.scss';

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
  const _addReport = (args:any)=>addReport(args)(store.dispatch, store.getState);

  useEffect(()=>{

    $(`#report`).on('show.bs.modal',  async (e: any) => {

      if (!types || types.length == 0) await _loadReportTypes();

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

      $.toast({
        text: '请选择举报类型',
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'error',
        loader: false,
        allowToastClose: false
      });

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

      $.toast({
        text: '举报目标不存在',
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'error',
        loader: false,
        allowToastClose: false
      });

      return
    }

    setSubmitting(true);
    
    let err, res;

    let result: any = await _addReport({ data });

    [ err, res ] = result;

    setSubmitting(false);

    if (err) {

      $.toast({
        text: err.message,
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'error',
        loader: false,
        allowToastClose: false
      });

    } else {

      $.toast({
        text: '提交成功',
        position: 'top-center',
        showHideTransition: 'slide',
        icon: 'success',
        loader: false,
        allowToastClose: false
      });

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
