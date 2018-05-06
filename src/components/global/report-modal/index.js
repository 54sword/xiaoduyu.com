import React, { Component } from 'react';
import Modal from '../../bootstrap/modal';


// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getReportTypes } from '../../../reducers/report-types';
import { loadReportTypes } from '../../../actions/report';


// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    types: getReportTypes(state)
  }),
  dispatch => ({
    loadReportTypes: bindActionCreators(loadReportTypes, dispatch)
  })
)
@CSSModules(styles)
export default class ReportModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      submitting: false,

      posts: null,
      comment: null,
      user: null
    }
    this.submit = this.submit.bind(this);
  }

  componentDidMount () {
    const self = this;

    const { types, loadReportTypes } = this.props;

    if (!types) {
      loadReportTypes();
    }

    $(`#report`).on('show.bs.modal', function (e) {
      const { posts, comment, user } = e.relatedTarget;
      self.setState({ posts, comment, user });
    });
  }

  submit() {

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
      title = (<div>我要举报 <b>{comment.user_id.nickname}</b> 用户</div>);
    }

    return (<div>
      <Modal id="report" title={'举报'} body={<div styleName="box">

          <div styleName="report-content">{title}</div>
          <div styleName="types">
            {types && types.map(item=>{
              return (<label key={item.id}><input type="radio" name="report" />{item.text}</label>)
            })}
          </div>
          <div styleName="detail">
            <textarea placeholder="补充举报说明" className="border"></textarea>
          </div>
          <div>
            <button onClick={this.submit} type="button" className="btn btn-primary">{submitting ? '提交中...' : '提交'}</button>
          </div>
        </div>} />
    </div>)

  }
}
