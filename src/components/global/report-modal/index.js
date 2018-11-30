import React, { Component } from 'react';
import Modal from '../../bootstrap/modal';

import $ from 'jquery';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getReportTypes } from '../../../store/reducers/report-types';
import { loadReportTypes, addReport } from '../../../store/actions/report';


// style
import './style.scss';

@connect(
  (state, props) => ({
    types: getReportTypes(state)
  }),
  dispatch => ({
    loadReportTypes: bindActionCreators(loadReportTypes, dispatch),
    addReport: bindActionCreators(addReport, dispatch)
  })
)
export default class ReportModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      submitting: false,

      posts: null,
      comment: null,
      user: null,
      type: 0
    }
    this.submit = this.submit.bind(this);
    this.chooseType = this.chooseType.bind(this);
  }

  componentDidMount () {
    const self = this;

    $(`#report`).on('show.bs.modal',  async (e) => {

      const { types, loadReportTypes } = self.props;

      if (!types) await loadReportTypes();

      const { posts, comment, user } = e.relatedTarget;
      self.setState({ posts, comment, user });
    });
  }

  async submit() {

    const { submitting, posts, comment, user, type } = this.state;
    const { detail } = this.state;
    const { addReport } = this.props;

    if (!type) {

      Toastify({
        text: '请选择举报类型',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      return

    }

    let data = {
      report_id: type
    };

    if (detail.value) data.detail = detail.value;

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

    this.setState({ submitting: true });

    let [ err, res ] = await addReport({ data });

    this.setState({ submitting: false });

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
      $('#report input:radio').each((index, dom)=>{
        dom.checked = false;
      });
      detail.value = '';

    }

  }

  chooseType(type) {
    const self = this;
    return () => {
      self.state.type = type.id;
    }
  }

  render () {

    const self = this;
    const { submitting, posts, comment, user } = this.state;
    const { types } = this.props;
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
            {types && types.map(item=>{
              return (<label key={item.id}><input type="radio" name="report" onClick={this.chooseType(item)} />{item.text}</label>)
            })}
          </div>
          <div styleName="detail">
            <textarea placeholder="补充举报说明" className="border" ref={(e)=>{ this.state.detail = e; }}></textarea>
          </div>
          <div>
            <button onClick={this.submit} type="button" className="btn btn-primary">{submitting ? '提交中...' : '提交'}</button>
          </div>
        </div>} />
    </div>)

  }
}
