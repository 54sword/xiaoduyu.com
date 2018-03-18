import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router-dom'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateComment } from '../../../actions/comment'
import { showSign } from '../../../actions/sign'
import { getProfile } from '../../../reducers/user'

// import LikeButton from '../like'
import HTMLText from '../../html-text'
// import BindingPhone from '../binding-phone'
// import CommentEditorModal from '../comment-editor-modal'
// import ItemView from '../views/item'

// import connectRedux from '../../../common/connect-redux'


@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    showSign: bindActionCreators(showSign, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch)
  })
)
@CSSModules(styles)
export default class CommentItem extends PureComponent {

  static propTypes = {
    comment: PropTypes.object.isRequired,
    showSign: PropTypes.func.isRequired,
    me: PropTypes.object.isRequired
  }

  static defaultProps = {
    summary: false,
    displayLike: true,
    displayReply: true,
    displayDate: true,
    displayEdit: true,
  }

  constructor(props) {
    super(props)
    this.renderUserView = this.renderUserView.bind(this)
    this.updateComment = this.updateComment.bind(this)
  }

  updateComment(e, data) {
    this.stopPropagation(e)
    const { comment, updateComment } = this.props
    data._id = comment._id
    updateComment(data)
  }

  // 用户的dom
  renderUserView(comment) {

    let self = this
    let { me, showSign,
      summary, displayLike, displayReply, displayDate, displayEdit
    } = this.props

    const updateComment = (data) => e => this.updateComment(e, data)

    return (<div styleName="item" key={comment._id}>
      <div styleName="item-head">
        <div>
          <Link to={`/people/${comment.user_id._id}`}>
            <div styleName="avatar" className="load-demand" data-load-demand={`<img width="40" height="40" src="${comment.user_id.avatar_url}" />`}></div>
            <b>{comment.user_id.nickname}</b>
          </Link>
          {comment.reply_id ? ` 回复了${comment.reply_id.user_id._id == comment.user_id._id ? '自己' : ' '}` : null}
          {comment.reply_id && comment.reply_id.user_id._id != comment.user_id._id ? <Link to={`/people/${comment.reply_id.user_id._id}`} onClick={this.stopPropagation}><b>{comment.reply_id.user_id.nickname}</b></Link> : null}
        </div>
        <div>{comment._create_at}</div>
      </div>

      <div styleName="item-body">
        <HTMLText content={comment.content_html} />
        <div styleName="reply-list">
          {comment.reply && comment.reply.map(item=>this.renderUserView(item))}
        </div>
      </div>

    </div>)
  }

  render () {
    return this.renderUserView(this.props.comment)
  }

}
