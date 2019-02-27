import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '@reducers/user';

// style
import './index.scss';

@connect(
  (state, props) => {
    return {
      me: getProfile(state)
    }
  },
  dispatch => ({
  })
)
export default class ListItem extends React.Component {

  static propTypes = {
    // 话题的id
    message: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {

    const { me, message } = this.props;

    // 自己发送的消息
    /*
    if (me._id == message.user_id._id) {

      return (<div styleName="item right">
        <div>
          <div styleName="avatar"><img src={message.user_id.avatar_url} /></div>
          <div styleName="nickname">
            <a href="">{message.user_id.nickname}</a> 发给 <a href="">{message.addressee_id.nickname}</a>
          </div>
          <div styleName="content">{message.content_html}</div>
          <div styleName="action">
            <a href="#" className="text-primary">查看对话</a>
            <a href="#" className="text-primary">回复</a>
            <a href="#" className="text-primary">举报</a>
          </div>
        </div>
      </div>)

    } else {
    */

      return (<Link to={`/session/${message._id}`} styleName="item" className="d-flex bd-highlight">
        <div className="p-2 w-100 bd-highlight">
          <div styleName="main">
            {message.unread_count ? <div styleName="unread">{message.unread_count}</div> : null}
            <div styleName="avatar">
              <img src={message.user_id.avatar_url} />
            </div>
            <div styleName="nickname">
              {message.user_id.nickname}
            </div>
            {message.last_message ?
              <div styleName="content">{message.last_message.content_summary}</div>
              : null}
          </div>
        </div>
        
        <div className="p-2 flex-shrink-1 bd-highlight">
          <div styleName="create-at">{message.last_message ? message.last_message._create_at : message._create_at}</div>
        </div>

      </Link>)

    // }


  }

}
